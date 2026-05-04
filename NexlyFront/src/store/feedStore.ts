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
  crear: (data: { contenido: string; imagenes?: string[]; visibilidad: 'PUBLICO' | 'SOLO_SEGUIDORES' | 'PRIVADO' }) => Promise<void>
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
    set({ loading: true, error: '', pagina: 0, publicaciones: [] })
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

  crear: async (data) => {
    const { data: nueva } = await crearPublicacion({ ...data })
    set((s) => ({ publicaciones: [nueva, ...s.publicaciones] }))
  },

  eliminar: async (id) => {
    await eliminarPublicacion(id)
    set((s) => ({ publicaciones: s.publicaciones.filter((p) => p.id !== id) }))
  },

  // Si ya tenía esa reacción → la quita. Si es distinta o no tenía → la pone.
  toggleReaccion: async (id, tipo) => {
    const actual = get().publicaciones.find((p) => p.id === id)?.miReaccion
    const { data: actualizada } = actual === tipo
      ? await quitarReaccion(id)
      : await reaccionar(id, tipo)
    set((s) => ({
      publicaciones: s.publicaciones.map((p) => p.id === id ? actualizada : p),
    }))
  },
}))
