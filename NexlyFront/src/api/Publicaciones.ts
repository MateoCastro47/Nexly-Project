import type { Publicacion, Page, TipoPost, TipoReaccion } from "../types";
import client from "./client";


export const getFeed = (page = 0, size = 10) => 
    client.get<Page<Publicacion>>('/publicaciones/feed', { params: {page, size}})

export const getPublicacion = (id:number) =>
    client.get<Publicacion>(`/publicaciones/${id}`)

export const crearPublicacion = (data: {
    contenido: string
    imagenes?: string[]
    visibilidad: 'PUBLICA' | 'SEGUIDORES' | 'PRIVADA'
    tipoPost?: TipoPost
    comunidadId?: number
    publicacionRefId?: number
}) => {
    // El backend usa @RequestParam — se envían como query params en la URL
    const params: Record<string, unknown> = {
        contenido: data.contenido,
        visibilidad: data.visibilidad,
    }
    if (data.tipoPost && data.tipoPost !== 'NORMAL') params.tipoPost = data.tipoPost
    if (data.comunidadId != null) params.comunidadId = data.comunidadId
    if (data.publicacionRefId != null) params.publicacionRefId = data.publicacionRefId
    if (data.imagenes?.length) params.imagenes = data.imagenes
    return client.post<Publicacion>('/publicaciones', null, { params })
}

export const eliminarPublicacion = (id: number) =>
  client.delete(`/publicaciones/${id}`)

// El backend espera ?tipo=ME_GUSTA como query param y retorna 204 void
export const reaccionar = (id: number, tipo: TipoReaccion) =>
  client.post<void>(`/publicaciones/${id}/reacciones`, null, { params: { tipo } })

export const quitarReaccion = (id: number) =>
  client.delete<void>(`/publicaciones/${id}/reacciones`)

export const getPublicacionesDeUsuario = (userId: number, page = 0, size = 10) =>
  client.get<Page<Publicacion>>(`/publicaciones/usuario/${userId}`, { params: { page, size } })