import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Router from './Router/Router'
import { useAuthStore } from './store/authStore'
import client from './api/client'
import type { Usuario } from './types'
import './index.css'

// Registro del service worker (PWA + Web Push). Funciona en http://localhost y HTTPS.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((e) => console.warn('No se pudo registrar el service worker:', e))
  })
}

const { setUsuario, setInitialized } = useAuthStore.getState()

client.get<Usuario>('/usuario/me')
  .then(({ data }) => setUsuario(data))
  .catch(() => {})
  .finally(() => {
    setInitialized()
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <Router />
      </StrictMode>
    )
  })
