import { create } from 'zustand'
import type { Publicacion, TipoReaccion } from '../types'
import { crearPublicacion, eliminarPublicacion, getFeed, quitarReaccion, reaccionar } from '../api/Publicaciones'

interface FeedStore {
  publicaciones: Publicacion[]
  pagina: number
  hayMas: boolean
  loading: boolean
  error: string

  cargarFeed: () => Promise<void>
  cargarMas: () => Promise<void>
  crear: (data: { contenido: string; imagenes?: string[]; visibilidad: 'PUBLICA' | 'SEGUIDORES' | 'PRIVADA' }) => Promise<void>
  eliminar: (id: number) => Promise<void>
  toggleReaccion: (id: number, tipo: TipoReaccion) => Promise<void>
}

export const useFeedStore = create<FeedStore>((set, get) => ({
  publicaciones: [],
  pagina: 0,
  hayMas: true,
  loading: false,
  error: '',

  cargarFeed: async () => {
    set({ loading: true, error: '', pagina: 0 })
    try {
      const { data } = await getFeed(0)
      set({ publicaciones: data.content, hayMas: !data.last, pagina: 0 })
    } catch {
      set({ error: 'No se pudo cargar el feed' })
    } finally {
      set({ loading: false })
    }
  },

  cargarMas: async () => {
    const { pagina, hayMas, loading } = get()
    if (!hayMas || loading) return
    set({ loading: true })
    try {
      const siguiente = pagina + 1
      const { data } = await getFeed(siguiente)
      set((s) => ({
        publicaciones: [...s.publicaciones, ...data.content],
        hayMas: !data.last,
        pagina: siguiente,
      }))
    } catch {
      set({ error: 'No se pudo cargar más publicaciones' })
    } finally {
      set({ loading: false })
    }
  },

  crear: async (data: { contenido: string; imagenes?: string[]; visibilidad: 'PUBLICA' | 'SEGUIDORES' | 'PRIVADA' }) => {
    const { data: nueva } = await crearPublicacion(data)
    set((s) => ({ publicaciones: [nueva, ...s.publicaciones] }))
  },

  eliminar: async (id) => {
    await eliminarPublicacion(id)
    set((s) => ({ publicaciones: s.publicaciones.filter((p) => p.id !== id) }))
  },

  toggleReaccion: async (id, tipo) => {
    const post = get().publicaciones.find((p) => p.id === id)
    if (!post) return
    const actual = post.miReaccion
    const quitando = actual === tipo

    // Optimistic update inmediato
    set((s) => ({
      publicaciones: s.publicaciones.map((p) => {
        if (p.id !== id) return p
        return {
          ...p,
          miReaccion: quitando ? undefined : tipo,
          totalReacciones: quitando
            ? p.totalReacciones - 1
            : actual
              ? p.totalReacciones        // cambia reacción, el total no varía
              : p.totalReacciones + 1,
        }
      }),
    }))

    try {
      if (quitando) {
        await quitarReaccion(id)
      } else {
        await reaccionar(id, tipo)
      }
    } catch {
      // Rollback al estado previo si falla la API
      set((s) => ({
        publicaciones: s.publicaciones.map((p) => (p.id === id ? post : p)),
      }))
    }
  },
}))
