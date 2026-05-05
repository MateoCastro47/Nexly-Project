import { create } from 'zustand'
import type { Usuario } from '../types'

interface AuthState {
  usuario: Usuario | null
  initialized: boolean
  setUsuario: (usuario: Usuario) => void
  setInitialized: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  initialized: false,
  setUsuario: (usuario) => set({ usuario }),
  setInitialized: () => set({ initialized: true }),
  logout: () => set({ usuario: null }),
}))
