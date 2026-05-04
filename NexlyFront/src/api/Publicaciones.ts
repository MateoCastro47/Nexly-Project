import type { Publicacion, Page, TipoReaccion } from "../types";
import client from "./client";


export const getFeed = (page = 0, size = 10) => 
    client.get<Page<Publicacion>>('/publicaciones/feed', { params: {page, size}})

export const getPublicacion = (id:number) =>
    client.get<Publicacion>(`/publicaciones/${id}`)

export const crearPublicacion = (data: {
    contenido: string
    imagenes?: string[]
    visibilidad: 'PUBLICO' | 'SOLO_SEGUIDORES' | 'PRIVADO'
    comunidadId?: number
}) => client.post<Publicacion>('/publicaciones', data)

export const eliminarPublicacion = (id: number) =>
  client.delete(`/publicaciones/${id}`)

export const reaccionar = (id: number, tipo: TipoReaccion) =>
  client.post<Publicacion>(`/publicaciones/${id}/reacciones`, { tipo })

export const quitarReaccion = (id: number) =>
  client.delete<Publicacion>(`/publicaciones/${id}/reacciones`)