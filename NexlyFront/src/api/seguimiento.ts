import client from './client'
import type { SolicitudSeguimiento } from '../types'

export const getSolicitudesPendientes = () =>
  client.get<SolicitudSeguimiento[]>('/usuario/me/solicitudes-seguimiento')

export const aceptarSolicitud = (seguidorId: number) =>
  client.post(`/usuario/me/solicitudes-seguimiento/${seguidorId}/aceptar`)

export const rechazarSolicitud = (seguidorId: number) =>
  client.delete(`/usuario/me/solicitudes-seguimiento/${seguidorId}`)
