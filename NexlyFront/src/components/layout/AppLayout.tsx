import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import DiscoverPanel from './DiscoverPanel'
import { useNotificacionesStore } from '../../store/notificacionesStore'

export default function AppLayout() {
  const { conectarWS, desconectarWS, cargarConteo } = useNotificacionesStore()

  useEffect(() => {
    cargarConteo()
    conectarWS()
    return () => desconectarWS()
  }, [cargarConteo, conectarWS, desconectarWS])

  return (
    <div className="flex min-h-screen app-bg">
      <Sidebar />

      {/* Columna central */}
      <main className="flex-1 max-w-180 mx-auto px-5 py-6">
        <Outlet />
      </main>

      {/* Panel derecho — Descubrimiento */}
      <DiscoverPanel />
    </div>
  )
}
