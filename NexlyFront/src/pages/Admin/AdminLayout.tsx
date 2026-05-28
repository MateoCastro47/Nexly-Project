import { NavLink, Outlet, Navigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const TABS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/usuarios', label: 'Usuarios', end: false },
  { to: '/admin/publicaciones', label: 'Publicaciones', end: false },
  { to: '/admin/comunidades', label: 'Comunidades', end: false },
]

export default function AdminLayout() {
  const usuario = useAuthStore((s) => s.usuario)

  // PrivateRoute ya redirige si no hay sesión; aquí solo gateamos por rol.
  if (usuario && usuario.rol !== 'ADMIN') return <Navigate to="/" replace />

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* ── Cabecera ── */}
      <header
        className="sticky top-0 z-10 backdrop-blur border-b"
        style={{
          background: 'linear-gradient(180deg, var(--color-surface), var(--color-surface-2))',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-bold shrink-0"
              style={{ background: 'var(--gradient-brand)', boxShadow: '0 4px 16px oklch(0.62 0.26 285 / 0.25)' }}
            >
              N
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold leading-tight truncate" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                Administración
              </h1>
              <p className="hidden sm:block text-[0.7rem]" style={{ color: 'var(--color-muted)' }}>Panel de control de Nexly</p>
            </div>
          </div>
          <Link
            to="/"
            className="text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all shrink-0"
            style={{ color: 'var(--color-text)', border: '1.5px solid var(--color-border)' }}
          >
            <span className="sm:hidden">← Volver</span>
            <span className="hidden sm:inline">← Volver a Nexly</span>
          </Link>
        </div>

        {/* Pestañas */}
        <nav className="max-w-6xl mx-auto flex gap-1.5 px-4 sm:px-6 pb-3 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-all ${isActive ? 'shadow-sm' : ''}`
              }
              style={({ isActive }) => (
                isActive
                  ? { background: 'var(--gradient-brand)', color: '#fff' }
                  : { color: 'var(--color-muted)', background: 'transparent' }
              )}
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="p-4 sm:p-6 max-w-6xl mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
