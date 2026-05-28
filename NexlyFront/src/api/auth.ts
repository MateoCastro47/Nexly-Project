import client from './client'
import type { Usuario } from '../types'

export const login = (email: string, contrasenha: string) =>
  client.post<Usuario>('/auth/login', { email, contrasenha })

export const register = (data: {
  nombreCompleto: string
  nombreUsuario: string
  email: string
  contrasena: string
  fechaNacimiento: string
}) => client.post<Usuario>('/auth/register', data)

export const logout = () => client.post('/auth/logout')

export const verificarEmail = (token: string) =>
  client.post<{ mensaje: string }>('/auth/verificar', { token })

export const reenviarVerificacion = (email: string) =>
  client.post<{ mensaje: string }>('/auth/reenviar-verificacion', { email })
