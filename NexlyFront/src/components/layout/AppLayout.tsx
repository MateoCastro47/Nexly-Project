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
    <div className="flex flex-col lg:flex-row min-h-screen app-bg pb-16 lg:pb-0">
      <Sidebar />

      {/* Columna central */}
      <main className={`flex-1 mx-auto px-5 py-6 ${esChat ? '' : 'max-w-180'} mb-auto`}>
        <Outlet />
      </main>

      {/* Panel derecho — Descubrimiento (oculto en el chat) */}
      {!esChat && <DiscoverPanel />}
    </div>
  )
}
