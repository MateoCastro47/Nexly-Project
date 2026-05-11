import client from './client'
import type { Notificacion } from '../types'

export const getNotificaciones = (pagina = 0) =>
  client.get<{ content: Notificacion[]; last: boolean; totalElements: number }>(
    '/notificaciones',
    { params: { page: pagina, size: 20 } },
  )

export const getConteoNoLeidas = () =>
  client.get<number>('/notificaciones/no-leidas/conteo')

export const marcarLeida = (id: number) =>
  client.patch(`/notificaciones/${id}/leer`)

export const marcarTodasLeidas = () =>
  client.patch('/notificaciones/leer-todas')
