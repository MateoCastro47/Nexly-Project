import { create } from 'zustand'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import type { Notificacion } from '../types'
import {
  getConteoNoLeidas,
  getNotificaciones,
  marcarLeida as apiMarcarLeida,
  marcarTodasLeidas as apiMarcarTodasLeidas,
} from '../api/notificaciones'

let stompClient: Client | null = null

interface NotificacionesStore {
  notificaciones: Notificacion[]
  noLeidas: number
  loading: boolean
  hayMas: boolean
  pagina: number

  cargarConteo: () => Promise<void>
  cargar: () => Promise<void>
  cargarMas: () => Promise<void>
  marcarLeida: (id: number) => Promise<void>
  marcarTodasLeidas: () => Promise<void>
  agregarNotificacion: (n: Notificacion) => void
  conectarWS: () => void
  desconectarWS: () => void
}

export const useNotificacionesStore = create<NotificacionesStore>((set, get) => ({
  notificaciones: [],
  noLeidas: 0,
  loading: false,
  hayMas: true,
  pagina: 0,

  cargarConteo: async () => {
    const { data } = await getConteoNoLeidas()
    set({ noLeidas: data })
  },

  cargar: async () => {
    set({ loading: true, pagina: 0 })
    try {
      const [{ data: page }, { data: conteo }] = await Promise.all([
        getNotificaciones(0),
        getConteoNoLeidas(),
      ])
      set({ notificaciones: page.content, hayMas: !page.last, noLeidas: conteo })
    } finally {
      set({ loading: false })
    }
  },

  cargarMas: async () => {
    const { pagina, hayMas, loading } = get()
    if (!hayMas || loading) return
    set({ loading: true })
    try {
      const sig = pagina + 1
      const { data } = await getNotificaciones(sig)
      set((s) => ({
        notificaciones: [...s.notificaciones, ...data.content],
        hayMas: !data.last,
        pagina: sig,
      }))
    } finally {
      set({ loading: false })
    }
  },

  marcarLeida: async (id) => {
    const notif = get().notificaciones.find((n) => n.id === id)
    if (!notif || notif.leida) return
    await apiMarcarLeida(id)
    set((s) => ({
      notificaciones: s.notificaciones.map((n) => (n.id === id ? { ...n, leida: true } : n)),
      noLeidas: Math.max(0, s.noLeidas - 1),
    }))
  },

  marcarTodasLeidas: async () => {
    await apiMarcarTodasLeidas()
    set((s) => ({
      notificaciones: s.notificaciones.map((n) => ({ ...n, leida: true })),
      noLeidas: 0,
    }))
  },

  agregarNotificacion: (n) => {
    set((s) => ({
      notificaciones: [n, ...s.notificaciones],
      noLeidas: s.noLeidas + 1,
    }))
  },

  conectarWS: () => {
    if (stompClient?.active) return
    stompClient = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient!.subscribe('/user/queue/notificaciones', (msg) => {
          try {
            const notif: Notificacion = JSON.parse(msg.body)
            get().agregarNotificacion(notif)
          } catch {
            // mensaje malformado, ignorar
          }
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
