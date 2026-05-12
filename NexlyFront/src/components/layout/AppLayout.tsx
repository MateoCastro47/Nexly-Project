import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import DiscoverPanel from './DiscoverPanel'
import { useNotificacionesStore } from '../../store/notificacionesStore'
import { useChatStore } from '../../store/chatStore'

export default function AppLayout() {
  const { conectarWS, desconectarWS, cargarConteo } = useNotificacionesStore()
  const esChat = useLocation().pathname.startsWith('/chat')
  const chat = useChatStore()


  useEffect(() => {
    cargarConteo()
    conectarWS()
    chat.cargarConversaciones()
    chat.conectarWS()
    return () => {desconectarWS(); chat.desconectarWS()}
  }, [])

  return (
    <div className="flex min-h-screen app-bg">
      <Sidebar />

      {/* Columna central */}
      <main className={`flex-1 mx-auto px-5 py-6 ${esChat ? '' : 'max-w-180'}`}>
        <Outlet />
      </main>

      {/* Panel derecho — Descubrimiento (oculto en el chat) */}
      {!esChat && <DiscoverPanel />}
    </div>
  )
}
