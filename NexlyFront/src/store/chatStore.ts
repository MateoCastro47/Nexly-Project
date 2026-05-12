import { create } from 'zustand'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs.min.js'
import {
  getConversaciones,
  getMensajes,
  iniciarDirecta as apiIniciarDirecta,
  enviarMensajeREST,
  marcarLeidos,
} from '../api/mensajes'
import type { Conversacion, Mensaje } from '../types'
import { useAuthStore } from './authStore'

let stompClient: Client | null = null

interface MensajesState {
  items: Mensaje[]
  pagina: number
  hayMas: boolean
  loading: boolean
  cargado: boolean
}

interface ChatStore {
  conversaciones: Conversacion[]
  activaId: number | null
  porConversacion: Record<number, MensajesState>
  loadingConversaciones: boolean
  enviando: boolean

  cargarConversaciones: () => Promise<void>
  seleccionar: (id: number) => Promise<void>
  cargarMas: (id: number) => Promise<void>
  enviar: (id: number, contenido: string) => Promise<void>
  iniciarDirecta: (otroId: number) => Promise<number>
  agregarMensaje: (msg: Mensaje) => void
  conectarWS: () => void
  desconectarWS: () => void
}

export const selectTotalNoLeidos = (s: ChatStore) =>
    s.conversaciones.reduce((acc, c) => acc + c.noLeidos, 0)


const estadoInicial = (): MensajesState => ({
  items: [],
  pagina: 0,
  hayMas: false,
  loading: false,
  cargado: false,
})

export const useChatStore = create<ChatStore>((set, get) => ({
  conversaciones: [],
  activaId: null,
  porConversacion: {},
  loadingConversaciones: false,
  enviando: false,

  cargarConversaciones: async () => {
    set({ loadingConversaciones: true })
    try {
      const { data } = await getConversaciones()
      set({ conversaciones: data })
    } finally {
      set({ loadingConversaciones: false })
    }
  },

  seleccionar: async (id) => {
    set({ activaId: id })
    const estado = get().porConversacion[id]
    if (estado?.cargado) return

    set((s) => ({
      porConversacion: {
        ...s.porConversacion,
        [id]: { ...estadoInicial(), loading: true },
      },
    }))
    try {
      const { data } = await getMensajes(id, 0)
      set((s) => ({
        porConversacion: {
          ...s.porConversacion,
          [id]: {
            items: [...data.content].reverse(), // backend devuelve desc, mostramos asc
            pagina: 0,
            hayMas: !data.last,
            loading: false,
            cargado: true,
          },
        },
        conversaciones: s.conversaciones.map((c) =>
          c.id === id ? { ...c, noLeidos: 0 } : c,
        ),
      }))
      marcarLeidos(id).catch(() => {})
    } catch {
      set((s) => ({
        porConversacion: { ...s.porConversacion, [id]: estadoInicial() },
      }))
    }
  },

  cargarMas: async (id) => {
    const estado = get().porConversacion[id]
    if (!estado || estado.loading || !estado.hayMas) return
    const nextPage = estado.pagina + 1
    set((s) => ({
      porConversacion: {
        ...s.porConversacion,
        [id]: { ...s.porConversacion[id], loading: true },
      },
    }))
    try {
      const { data } = await getMensajes(id, nextPage)
      set((s) => ({
        porConversacion: {
          ...s.porConversacion,
          [id]: {
            ...s.porConversacion[id],
            items: [...[...data.content].reverse(), ...s.porConversacion[id].items],
            pagina: nextPage,
            hayMas: !data.last,
            loading: false,
          },
        },
      }))
    } catch {
      set((s) => ({
        porConversacion: {
          ...s.porConversacion,
          [id]: { ...s.porConversacion[id], loading: false },
        },
      }))
    }
  },

  enviar: async (id, contenido) => {
    set({ enviando: true })
    try {
      const { data } = await enviarMensajeREST(id, contenido)
      // Agrega aquí (el WS broadcast deduplica por id)
      get().agregarMensaje(data)
    } finally {
      set({ enviando: false })
    }
  },

  iniciarDirecta: async (otroId) => {
    const { data } = await apiIniciarDirecta(otroId)
    set((s) => ({
      conversaciones: s.conversaciones.find((c) => c.id === data.id)
        ? s.conversaciones
        : [data, ...s.conversaciones],
    }))
    return data.id
  },

  agregarMensaje: (msg) => {
    const miId = useAuthStore.getState().usuario?.id
    const esMio = msg.autorId === miId
    const esActiva = msg.conversacionId === get().activaId

    set((s) => {
            const estado = s.porConversacion[msg.conversacionId]
            if(estado?.items.some((m) => m.id === msg.id)) return s

            return{
                porConversacion: estado
                ?{
                    ...s.porConversacion,
                    [msg.conversacionId]: {...estado, items: [...estado.items, msg] },
                }
                : s.porConversacion,
            conversaciones: s.conversaciones.map((c) =>
                c.id === msg.conversacionId
                ? {
                    ...c,
                    ultimoMensajePreview: msg.contenido,
                    noLeidos: esMio || esActiva ? 0 : c.noLeidos + 1
                }
                : c,
            ),
        }
    })

    if (esActiva && !esMio){
        marcarLeidos(msg.conversacionId).catch(() => {})
    }

    if(!get().conversaciones.some((c) => c.id === msg.conversacionId)) {
        get().cargarConversaciones()
    }
  },

  conectarWS: () => {
    if (stompClient?.active) return
    stompClient = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient!.subscribe('/user/queue/mensajes', (frame) => {
          try {
            const msg: Mensaje = JSON.parse(frame.body)
            get().agregarMensaje(msg)
          } catch {}
        })
      },
    })
    stompClient.activate()
  },

  desconectarWS: () => {
    stompClient?.deactivate()
    stompClient = null
  },
}))
