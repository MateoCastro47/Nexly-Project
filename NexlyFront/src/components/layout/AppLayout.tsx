import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import DiscoverPanel from './DiscoverPanel'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen app-bg">
      <Sidebar />

      {/* Columna central */}
      <main className="flex-1 max-w-2xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Panel derecho — Descubrimiento */}
      <DiscoverPanel />
    </div>
  )
}
