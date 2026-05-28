import { create } from 'zustand'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
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

  cargarConversaciones: () => Promise<void>
  seleccionar: (id: number | null) => Promise<void>
  cargarMas: (id: number) => Promise<void>
  enviar: (id: number, contenido: string) => Promise<void>
  reintentarEnvio: (msg: Mensaje) => void
  iniciarDirecta: (otroId: number) => Promise<number>
  agregarMensaje: (msg: Mensaje) => void
  conectarWS: () => void
  desconectarWS: () => void
}

export const selectTotalNoLeidos = (s: ChatStore) =>
    s.conversaciones.reduce((acc, c) => acc + c.noLeidos, 0)

// Mueve la conversación `id` al principio de la lista aplicándole `patch`.
const subirAlTope = (
  lista: Conversacion[],
  id: number,
  patch: Partial<Conversacion>,
): Conversacion[] => {
  const idx = lista.findIndex((c) => c.id === id)
  if (idx === -1) return lista
  return [{ ...lista[idx], ...patch }, ...lista.slice(0, idx), ...lista.slice(idx + 1)]
}


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
    if (id === null) return
    const estado = get().porConversacion[id]
    if (estado?.cargado) {
       // marcar lectura si ya estaba cargado
       marcarLeidos(id).catch(console.error)
       return
    }

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
    const u = useAuthStore.getState().usuario
    const tempId = -Date.now()
    const optimista: Mensaje = {
        id: tempId,
        conversacionId: id,
        autorId: u?.id ?? 0,
        autorUsername: u?.nombreUsuario ?? '',
        autorFoto: u?.fotoPerfil,
        contenido,
        fechaEnvia: new Date().toISOString(),
        pendiente: true,
    }
    // Inserción optimista
    set((s) => ({
        porConversacion: {
            ...s.porConversacion,
            [id]: {
                ...(s.porConversacion[id] ?? estadoInicial()),
                items: [...(s.porConversacion[id]?.items ?? []), optimista],
            },
        },
        conversaciones: subirAlTope(s.conversaciones, id, { ultimoMensajePreview: contenido }),
    }))
    try {
        const { data } = await enviarMensajeREST(id, contenido)
        // Reconciliar: si el eco por WS llegó antes, ya está → borra el temporal;
        // si no, sustituye el temporal por el mensaje real.
        set((s) => {
            const e = s.porConversacion[id]
            if (!e) return s
            const yaExiste = e.items.some((m) => m.id === data.id)
            return {
                porConversacion: {
                    ...s.porConversacion,
                    [id]: {
                        ...e,
                        items: yaExiste
                            ? e.items.filter((m) => m.id !== tempId)
                            : e.items.map((m) => (m.id === tempId ? data : m)),
                    },
                },
            }
        })
    } catch {
        // Marca el mensaje como fallido para mostrar "Reintentar"
        set((s) => {
            const e = s.porConversacion[id]
            if (!e) return s
            return {
                porConversacion: {
                    ...s.porConversacion,
                    [id]: {
                        ...e,
                        items: e.items.map((m) =>
                            m.id === tempId ? { ...m, pendiente: false, error: true } : m,
                        ),
                    },
                },
            }
        })
    }
  },

  reintentarEnvio: (msg) => {
    set((s) => {
        const e = s.porConversacion[msg.conversacionId]
        if (!e) return s
        return {
            porConversacion: {
                ...s.porConversacion,
                [msg.conversacionId]: { ...e, items: e.items.filter((m) => m.id !== msg.id) },
            },
        }
    })
    get().enviar(msg.conversacionId, msg.contenido)
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
        if (estado?.items.some((m) => m.id === msg.id)) return s

        let porConversacion = s.porConversacion
        if (estado) {
            let items = estado.items
            if (esMio) {
                // El eco de un mensaje propio sustituye al optimista equivalente
                const i = items.findIndex(
                    (m) => m.pendiente && !m.error && m.contenido === msg.contenido,
                )
                if (i !== -1) items = items.filter((_, j) => j !== i)
            }
            porConversacion = {
                ...s.porConversacion,
                [msg.conversacionId]: { ...estado, items: [...items, msg] },
            }
        }

        const actual = s.conversaciones.find((c) => c.id === msg.conversacionId)
        return {
            porConversacion,
            conversaciones: subirAlTope(s.conversaciones, msg.conversacionId, {
                ultimoMensajePreview: msg.contenido,
                noLeidos: esMio || esActiva ? 0 : (actual?.noLeidos ?? 0) + 1,
            }),
        }
    })

    if (esActiva && !esMio) {
        marcarLeidos(msg.conversacionId).catch(() => {})
    }

    if (!get().conversaciones.some((c) => c.id === msg.conversacionId)) {
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
