import client from './client'
import type { Page } from '../types'

export interface AdminStats {
  usuarios: number
  usuariosActivos: number
  usuariosVerificados: number
  nuevosUsuarios7d: number
  publicaciones: number
  comunidades: number
  comunidadesPublicas: number
  comentarios: number
  reacciones: number
  publicacionesPorTipo: Record<string, number>
}
export interface AdminUsuario {
  id: number; nombreCompleto: string; nombreUsuario: string; email: string
  rol: string; activo: boolean; emailVerificado: boolean; fechaRegistro: string
}
export interface AdminPublicacion {
  id: number; contenido: string; autorId: number; autorUsername: string
  comunidadNombre?: string; tipoPost?: string; fechaCreacion: string
}
export interface AdminComunidad {
  id: number; nombre: string; categoria?: string; creadorUsername?: string
  totalMiembros: number; esPublica: boolean; fechaCreacion: string
}

export const getStats = () => client.get<AdminStats>('/admin/stats')

export const getUsuarios = (q = '', page = 0, size = 20) =>
  client.get<Page<AdminUsuario>>('/admin/usuarios', { params: { q, page, size } })
export const setUsuarioEstado = (id: number, activo: boolean) =>
  client.patch(`/admin/usuarios/${id}/estado`, null, { params: { activo } })
export const setUsuarioRol = (id: number, rol: string) =>
  client.patch(`/admin/usuarios/${id}/rol`, null, { params: { rol } })
export const eliminarUsuario = (id: number) => client.delete(`/admin/usuarios/${id}`)

export const getPublicaciones = (page = 0, size = 20) =>
  client.get<Page<AdminPublicacion>>('/admin/publicaciones', { params: { page, size } })
export const eliminarPublicacion = (id: number) => client.delete(`/admin/publicaciones/${id}`)

export const getComunidades = (page = 0, size = 20) =>
  client.get<Page<AdminComunidad>>('/admin/comunidades', { params: { page, size } })
export const eliminarComunidad = (id: number) => client.delete(`/admin/comunidades/${id}`)
