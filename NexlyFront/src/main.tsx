import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './Router/Router'
import { useAuthStore } from './store/authStore'
import client from './api/client'
import type { Usuario } from './types'
import './index.css'

const { setUsuario, setInitialized } = useAuthStore.getState()

client.get<Usuario>('/usuario/me')
  .then(({ data }) => setUsuario(data))
  .catch(() => {})
  .finally(() => {
    setInitialized()
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    )
  })
