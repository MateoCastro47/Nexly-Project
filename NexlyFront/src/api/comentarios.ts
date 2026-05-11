import type { Comentario, Page, TipoReaccion } from '../types'
import client from './client'

export const getComentarios = (pubId: number, page = 0, size = 20) =>
  client.get<Page<Comentario>>(`/publicaciones/${pubId}/comentarios`, { params: { page, size } })

export const getRespuestas = (comentarioId: number, page = 0) =>
  client.get<Page<Comentario>>(`/comentarios/${comentarioId}/respuestas`, { params: { page, size: 20 } })

export const crearComentario = (pubId: number, contenido: string, padreId?: number) =>
  client.post<Comentario>(`/publicaciones/${pubId}/comentarios`, null, {
    params: { contenido, ...(padreId != null ? { padreId } : {}) },
  })

export const eliminarComentario = (id: number) =>
  client.delete(`/comentarios/${id}`)

export const reaccionarComentario = (id: number, tipo: TipoReaccion) =>
  client.post<void>(`/comentarios/${id}/reacciones`, null, { params: { tipo } })

export const quitarReaccionComentario = (id: number) =>
  client.delete<void>(`/comentarios/${id}/reacciones`)
