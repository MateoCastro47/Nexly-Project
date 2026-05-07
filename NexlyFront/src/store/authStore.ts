import { create } from 'zustand'
import type { Usuario } from '../types'

interface AuthState {
  usuario: Usuario | null
  initialized: boolean
  onboardingPendiente: boolean
  setUsuario: (usuario: Usuario) => void
  setInitialized: () => void
  cerrarOnboarding: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  initialized: false,
  onboardingPendiente: false,
  setUsuario: (usuario) => set({
    usuario,
    onboardingPendiente: !usuario.onboardingCompletado,
  }),
  setInitialized: () => set({ initialized: true }),
  cerrarOnboarding: () => set({ onboardingPendiente: false }),
  logout: () => set({ usuario: null, onboardingPendiente: false }),
}))
