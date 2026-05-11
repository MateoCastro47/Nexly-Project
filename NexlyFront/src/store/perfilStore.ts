import { create } from 'zustand'
import type { Usuario, Publicacion, TipoReaccion } from '../types'
import { getPerfilPorNombreUsuario, seguirUsuario, dejarDeSeguirUsuario } from '../api/usuario'
import { getPublicacionesDeUsuario, reaccionar, quitarReaccion, eliminarPublicacion } from '../api/Publicaciones'

interface PerfilStore {
  usuario: Usuario | null
  publicaciones: Publicacion[]
  pagina: number
  hayMas: boolean
  loading: boolean
  loadingPosts: boolean
  error: string

  cargarPerfil: (nombreUsuario: string) => Promise<void>
  cargarMasPosts: () => Promise<void>
  toggleSeguir: () => Promise<void>
  toggleReaccion: (id: number, tipo: TipoReaccion) => Promise<void>
  eliminar: (id: number) => Promise<void>
}

export const usePerfilStore = create<PerfilStore>((set, get) => ({
  usuario: null,
  publicaciones: [],
  pagina: 0,
  hayMas: false,
  loading: false,
  loadingPosts: false,
  error: '',

  cargarPerfil: async (nombreUsuario) => {
    set({ loading: true, error: '', usuario: null, publicaciones: [], pagina: 0, hayMas: false })
    try {
      const { data: usuario } = await getPerfilPorNombreUsuario(nombreUsuario)
      set({ usuario, loadingPosts: true })
      const { data: posts } = await getPublicacionesDeUsuario(usuario.id, 0)
      set({ publicaciones: posts.content, hayMas: !posts.last, pagina: 0 })
    } catch (e: unknown) {
      const status = (e as { response?: { status: number } }).response?.status
      set({ error: status === 404 ? '404' : 'Error al cargar el perfil' })
    } finally {
      set({ loading: false, loadingPosts: false })
    }
  },

  cargarMasPosts: async () => {
    const { usuario, hayMas, loadingPosts } = get()
    if (!usuario || !hayMas || loadingPosts) return
    set({ loadingPosts: true })
    try {
      const siguiente = get().pagina + 1
      const { data } = await getPublicacionesDeUsuario(usuario.id, siguiente)
      set((s) => ({
        publicaciones: [...s.publicaciones, ...data.content],
        hayMas: !data.last,
        pagina: siguiente,
      }))
    } catch {
      // silencioso — el usuario puede reintentar haciendo scroll
    } finally {
      set({ loadingPosts: false })
    }
  },

  toggleSeguir: async () => {
    const { usuario } = get()
    if (!usuario) return
    const antes = { ...usuario }
    const siguiendo = usuario.siguiendo
    set({
      usuario: {
        ...usuario,
        siguiendo: !siguiendo,
        seguidores: usuario.seguidores + (siguiendo ? -1 : 1),
      },
    })
    try {
      if (siguiendo) await dejarDeSeguirUsuario(usuario.id)
      else await seguirUsuario(usuario.id)
    } catch {
      set({ usuario: antes })
    }
  },

  toggleReaccion: async (id, tipo) => {
    const post = get().publicaciones.find((p) => p.id === id)
    if (!post) return
    const actual = post.reaccionDelVisor
    const quitando = actual === tipo

    set((s) => ({
      publicaciones: s.publicaciones.map((p) => {
        if (p.id !== id) return p
        return {
          ...p,
          reaccionDelVisor: quitando ? undefined : tipo,
          conteoReacciones: quitando
            ? p.conteoReacciones - 1
            : actual
              ? p.conteoReacciones
              : p.conteoReacciones + 1,
        }
      }),
    }))

    try {
      if (quitando) await quitarReaccion(id)
      else await reaccionar(id, tipo)
    } catch {
      set((s) => ({
        publicaciones: s.publicaciones.map((p) => (p.id === id ? post : p)),
      }))
    }
  },

  eliminar: async (id) => {
    await eliminarPublicacion(id)
    set((s) => ({ publicaciones: s.publicaciones.filter((p) => p.id !== id) }))
  },
}))
