import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <Sidebar />

      {/* Columna central */}
      <main className="flex-1 max-w-2xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Panel derecho — vacío hasta sugerencias de usuarios */}
      <aside className="hidden xl:block w-72 shrink-0 px-4 py-6" />
    </div>
  )
}
