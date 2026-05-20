import { create } from 'zustand'
import type { Comunidad, MiembroComunidad, Publicacion, RolComunidad } from '../types'
import {
  listarComunidades,
  buscarComunidadesPaginado,
  getComunidad,
  crearComunidad as apiCrear,
  unirseComunidad,
  salirComunidad,
  getMiembros as apiGetMiembros,
  getPendientes as apiGetPendientes,
  aceptarMiembro as apiAceptar,
  rechazarMiembro as apiRechazar,
  cambiarRol as apiCambiarRol,
  banearMiembro as apiBanear,
} from '../api/comunidades'
import { getPublicacionesDeComunidad } from '../api/Publicaciones'

interface ComunidadesStore {
  lista: Comunidad[]
  pagina: number
  hayMas: boolean
  loadingLista: boolean
  termino: string

  actual: Comunidad | null
  loadingDetalle: boolean
  errorDetalle: string

  miembros: MiembroComunidad[]
  paginaMiembros: number
  hayMasMiembros: boolean
  loadingMiembros: boolean

  pendientes: MiembroComunidad[]
  loadingPendientes: boolean
  pendientesProhibidas: boolean

  publicaciones: Publicacion[]
  paginaPosts: number
  hayMasPosts: boolean
  loadingPosts: boolean

  cargarLista: (q?: string) => Promise<void>
  cargarMasLista: () => Promise<void>
  cargarDetalle: (id: number) => Promise<void>
  limpiarDetalle: () => void
  crear: (data: { nombre: string; descripcion?: string; reglas?: string; foto?: string; esPublica: boolean; categoriaId?: number }) => Promise<Comunidad>
  toggleMembresia: () => Promise<void>
  cargarMiembros: () => Promise<void>
  cargarMasMiembros: () => Promise<void>
  cargarPendientes: () => Promise<void>
  aceptarSolicitud: (usuarioId: number) => Promise<void>
  rechazarSolicitud: (usuarioId: number) => Promise<void>
  cambiarRolMiembro: (usuarioId: number, rol: RolComunidad) => Promise<void>
  banearMiembro: (usuarioId: number, baneado: boolean) => Promise<void>
  cargarPosts: () => Promise<void>
  cargarMasPosts: () => Promise<void>
  agregarPublicacion: (p: Publicacion) => void
}

export const useComunidadesStore = create<ComunidadesStore>((set, get) => ({
  lista: [], pagina: 0, hayMas: true, loadingLista: false, termino: '',
  actual: null, loadingDetalle: false, errorDetalle: '',
  miembros: [], paginaMiembros: 0, hayMasMiembros: true, loadingMiembros: false,
  pendientes: [], loadingPendientes: false, pendientesProhibidas: false,
  publicaciones: [], paginaPosts: 0, hayMasPosts: true, loadingPosts: false,

  cargarLista: async (q = '') => {
    set({ loadingLista: true, pagina: 0, termino: q })
    try {
      const { data } = q ? await buscarComunidadesPaginado(q, 0) : await listarComunidades(0)
      set({ lista: data.content, hayMas: !data.last, pagina: 0 })
    } finally { set({ loadingLista: false }) }
  },

  cargarMasLista: async () => {
    const { pagina, hayMas, loadingLista, termino } = get()
    if (!hayMas || loadingLista) return
    set({ loadingLista: true })
    try {
      const sig = pagina + 1
      const { data } = termino ? await buscarComunidadesPaginado(termino, sig) : await listarComunidades(sig)
      set((s) => ({ lista: [...s.lista, ...data.content], hayMas: !data.last, pagina: sig }))
    } finally { set({ loadingLista: false }) }
  },

  cargarDetalle: async (id) => {
    set({ loadingDetalle: true, errorDetalle: '', actual: null })
    try {
      const { data } = await getComunidad(id)
      set({ actual: data })
    } catch (e: unknown) {
      const err = e as { response?: { status?: number } }
      set({ errorDetalle: err?.response?.status === 404 ? '404' : 'No se pudo cargar la comunidad' })
    } finally { set({ loadingDetalle: false }) }
  },

  limpiarDetalle: () => set({
    actual: null, errorDetalle: '',
    miembros: [], paginaMiembros: 0, hayMasMiembros: true,
    pendientes: [], pendientesProhibidas: false,
    publicaciones: [], paginaPosts: 0, hayMasPosts: true,
  }),

  crear: async (data) => {
    const { data: nueva } = await apiCrear(data)
    set((s) => ({ lista: [nueva, ...s.lista] }))
    return nueva
  },

  toggleMembresia: async () => {
    const c = get().actual
    if (!c) return
    const eraMiembro = c.esMiembro
    set({ actual: { ...c, esMiembro: !eraMiembro, totalMiembros: c.totalMiembros + (eraMiembro ? -1 : 1) } })
    try {
      if (eraMiembro) await salirComunidad(c.id)
      else await unirseComunidad(c.id)
    } catch { set({ actual: c }) }
  },

  cargarMiembros: async () => {
    const c = get().actual
    if (!c) return
    set({ loadingMiembros: true, paginaMiembros: 0 })
    try {
      const { data } = await apiGetMiembros(c.id, 0)
      set({ miembros: data.content, hayMasMiembros: !data.last, paginaMiembros: 0 })
    } finally { set({ loadingMiembros: false }) }
  },

  cargarMasMiembros: async () => {
    const c = get().actual
    const { paginaMiembros, hayMasMiembros, loadingMiembros } = get()
    if (!c || !hayMasMiembros || loadingMiembros) return
    set({ loadingMiembros: true })
    try {
      const sig = paginaMiembros + 1
      const { data } = await apiGetMiembros(c.id, sig)
      set((s) => ({ miembros: [...s.miembros, ...data.content], hayMasMiembros: !data.last, paginaMiembros: sig }))
    } finally { set({ loadingMiembros: false }) }
  },

  cargarPendientes: async () => {
    const c = get().actual
    if (!c) return
    set({ loadingPendientes: true, pendientesProhibidas: false })
    try {
      const { data } = await apiGetPendientes(c.id)
      set({ pendientes: data })
    } catch (e: unknown) {
      const err = e as { response?: { status?: number } }
      if (err?.response?.status === 403) set({ pendientesProhibidas: true })
    } finally { set({ loadingPendientes: false }) }
  },

  aceptarSolicitud: async (usuarioId) => {
    const c = get().actual
    if (!c) return
    await apiAceptar(c.id, usuarioId)
    set((s) => ({
      pendientes: s.pendientes.filter((p) => p.usuarioId !== usuarioId),
      actual: s.actual ? { ...s.actual, totalMiembros: s.actual.totalMiembros + 1 } : null,
    }))
  },

  rechazarSolicitud: async (usuarioId) => {
    const c = get().actual
    if (!c) return
    await apiRechazar(c.id, usuarioId)
    set((s) => ({ pendientes: s.pendientes.filter((p) => p.usuarioId !== usuarioId) }))
  },

  cambiarRolMiembro: async (usuarioId, rol) => {
    const c = get().actual
    if (!c) return
    await apiCambiarRol(c.id, usuarioId, rol)
    set((s) => ({ miembros: s.miembros.map((m) => (m.usuarioId === usuarioId ? { ...m, rol } : m)) }))
  },

  banearMiembro: async (usuarioId, baneado) => {
    const c = get().actual
    if (!c) return
    await apiBanear(c.id, usuarioId, baneado)
    if (baneado) {
      set((s) => ({
        miembros: s.miembros.filter((m) => m.usuarioId !== usuarioId),
        actual: s.actual ? { ...s.actual, totalMiembros: Math.max(0, s.actual.totalMiembros - 1) } : null,
      }))
    }
  },

  cargarPosts: async () => {
    const c = get().actual
    if (!c) return
    set({ loadingPosts: true, paginaPosts: 0 })
    try {
      const { data } = await getPublicacionesDeComunidad(c.id, 0)
      set({ publicaciones: data.content, hayMasPosts: !data.last, paginaPosts: 0 })
    } finally { set({ loadingPosts: false }) }
  },

  cargarMasPosts: async () => {
    const c = get().actual
    const { paginaPosts, hayMasPosts, loadingPosts } = get()
    if (!c || !hayMasPosts || loadingPosts) return
    set({ loadingPosts: true })
    try {
      const sig = paginaPosts + 1
      const { data } = await getPublicacionesDeComunidad(c.id, sig)
      set((s) => ({ publicaciones: [...s.publicaciones, ...data.content], hayMasPosts: !data.last, paginaPosts: sig }))
    } finally { set({ loadingPosts: false }) }
  },

  agregarPublicacion: (p) => {
    set((s) => ({ publicaciones: [p, ...s.publicaciones] }))
  },
}))
