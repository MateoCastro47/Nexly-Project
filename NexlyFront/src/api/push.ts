import client from './client'

export interface SuscripcionPayload {
  endpoint: string
  p256dh: string
  auth: string
}

export const getVapidPublicKey = () =>
  client.get<{ publicKey: string }>('/push/public-key').then((r) => r.data.publicKey)

export const enviarSuscripcion = (sub: SuscripcionPayload) =>
  client.post('/push/subscribe', sub)

export const eliminarSuscripcion = (endpoint: string) =>
  client.delete('/push/subscribe', { params: { endpoint } })
