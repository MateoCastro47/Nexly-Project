import client from './client'
import type { Usuario } from '../types'

export interface OnboardingPayload {
  fotoPerfil?: string
  fotoPortada?: string
  biografia?: string
  ubicacion?: string
  enlaceWeb?: string
  perfilPrivado?: boolean
}

export interface EditarPerfilPayload {
  nombreCompleto?: string;
  biografia?: string;
  fotoPerfil?: string;
  fotoPortada?: string;
}

export const completarOnboarding = (data: OnboardingPayload) =>
  client.post<Usuario>('/usuario/onboarding', data)

export const getSugerencias = (limit = 5) =>
  client.get<Usuario[]>('/usuario/sugerencias', { params: { limit } })

export const getPerfilPorNombreUsuario = (nombreUsuario: string) =>
  client.get<Usuario>(`/usuario/username/${nombreUsuario}`)

export const seguirUsuario = (id: number) =>
  client.post<void>(`/usuario/${id}/seguir`)

export const dejarDeSeguirUsuario = (id: number) =>
  client.delete<void>(`/usuario/${id}/seguir`)

export const actualizarPerfil = (data: EditarPerfilPayload) => 
  client.put<Usuario>('/usuario/perfil', data)