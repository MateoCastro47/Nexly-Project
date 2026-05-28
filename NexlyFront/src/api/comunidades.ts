import type { MiembroComunidad, Comunidad, Page, RolComunidad } from "../types";
import client from "./client";

export const listarComunidades = (page = 0, size = 12) =>
    client.get<Page<Comunidad>>('/comunidades', {params: {page, size}})

export const buscarComunidadesPaginado = (q: string, page = 0, size = 12) =>
    client.get<Page<Comunidad>>('/comunidades/buscar', { params: {q, page, size}})

export const getComunidad = (id: number) => 
    client.get<Comunidad>(`/comunidades/${id}`)

export const crearComunidad = (data: {
    nombre: string
    descripcion?: string
    reglas?: string
    foto?: string
    esPublica: boolean
    categoriaId?: number
}) => client.post<Comunidad>('/comunidades', data)

export const unirseComunidad = (id: number) => 
    client.post<void> (`/comunidades/${id}/unirse`)

export const salirComunidad = (id: number) => 
    client.delete<void> (`/comunidades/${id}/salir`)

export const silenciarComunidad = (id:number, silenciada: boolean) => 
    client.put<void>(`/comunidades/${id}/silenciar`, null, { params: { silenciada }})

export const getMiembros = (id:number, page= 0, size = 20) => 
    client.get<Page<MiembroComunidad>>(`/comunidades/${id}/miembros`, { params: { page, size }})

export const getPendientes = (id:number) =>
    client.get<MiembroComunidad[]>(`/comunidades/${id}/pendientes`)

export const aceptarMiembro = (id: number, usuarioId: number) =>
  client.post<void>(`/comunidades/${id}/miembros/${usuarioId}/aceptar`)

export const rechazarMiembro = (id: number, usuarioId: number) =>
  client.delete<void>(`/comunidades/${id}/miembros/${usuarioId}/rechazar`)

export const cambiarRol = (id: number, usuarioId: number, rol: RolComunidad) =>
  client.put<void>(`/comunidades/${id}/miembros/${usuarioId}/rol`, null, { params: { rol } })

export const banearMiembro = (id: number, usuarioId: number, baneado: boolean) =>
  client.put<void>(`/comunidades/${id}/miembros/${usuarioId}/banear`, null, { params: { baneado } })
