import { NavLink, useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"
import { useNotificacionesStore } from "../../store/notificacionesStore"
import { useChatStore, selectTotalNoLeidos } from "../../store/chatStore"
import { logout } from "../../api/auth"

const NAV = [{
    to: '/',
    label: 'Inicio',
    icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    ),
},
{
    to: '/comunidades',
    label: 'Comunidades',
    icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
},
{
    to: '/chat',
    label: 'Chat',
    icon: (
         <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    ),
},
{
    to: '/notificaciones',
    label: 'Notificaciones',
    icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    ),
},
]

export default function Sidebar() {
  const { usuario, logout: clearUsuario } = useAuthStore()
  const noLeidas = useNotificacionesStore((s) => s.noLeidas)
  const noLeidosChat = useChatStore(selectTotalNoLeidos)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    clearUsuario()
    navigate('/login')
  }

  return(
    <aside
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col lg:sticky lg:top-0 lg:justify-between lg:w-68 lg:shrink-0 lg:h-screen lg:px-5 lg:py-6 lg:border-r border-t lg:border-t-0"
        style={{
          background: 'linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface-2) 100%)',
          borderColor: 'var(--color-border)',
        }}
    >
        <div className="flex w-full lg:block lg:w-auto">
        {/* Logo con gradiente - Oculto en móvil */}
        <div className="hidden lg:flex px-3 mb-7 items-center gap-2">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-bold text-lg"
            style={{
              background: 'var(--gradient-brand)',
              boxShadow: '0 4px 16px oklch(0.62 0.26 285 / 0.25)',
            }}
          >
            N
          </div>
          <span
            className="text-xl font-bold"
            style={{
              fontFamily: 'var(--font-display)',
              background: 'var(--gradient-brand)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Nexly
          </span>
        </div>

        {/* Nav - flex row on mobile, col on desktop */}
        <nav className="flex w-full justify-around lg:flex-col lg:justify-start lg:gap-1.5 p-2 lg:p-0">
          {NAV.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `nav-link flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-1 lg:gap-3.5 px-2 py-2 lg:px-4 lg:py-3 rounded-2xl text-[10px] lg:text-[1rem] font-medium lg:font-semibold flex-1 lg:flex-none ${isActive ? 'active' : ''}`
              }
            >
              <span className="relative">
                {icon}
                {to === '/notificaciones' && noLeidas > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-4 h-4 px-0.5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: 'var(--color-accent-2)' }}
                  >
                    {noLeidas > 99 ? '99+' : noLeidas}
                  </span>
                )}
                {to === '/chat' && noLeidosChat > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-4 h-4 px-0.5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: 'var(--color-accent-2)' }}
                  >
                    {noLeidosChat > 99 ? '99+' : noLeidosChat}
                  </span>
                )}
              </span>
              {label}
            </NavLink>
          ))}

          {usuario?.rol === 'ADMIN' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `nav-link hidden lg:flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[1rem] font-semibold ${isActive ? 'active' : ''}`
              }
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" />
              </svg>
              Administración
            </NavLink>
          )}

          {/* Perfil Icon en Mobile */}
          {usuario && (
             <NavLink
             to={`/perfil/${usuario.nombreUsuario}`}
             className={({ isActive }) =>
               `nav-link flex lg:hidden flex-col items-center justify-center gap-1 px-2 py-2 rounded-2xl text-[10px] font-medium flex-1 ${isActive ? 'active' : ''}`
             }
           >
             <span className="relative">
                {usuario.fotoPerfil ? (
                    <img src={usuario.fotoPerfil} alt="Perfil" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: 'var(--color-accent-1)' }}>
                        {usuario.nombreCompleto[0].toUpperCase()}
                    </div>
                )}
             </span>
             Perfil
           </NavLink>
          )}
        </nav>

      </div>

      {usuario && (
        <div className="hidden lg:flex flex-col gap-2">
            <div className="divider-brand mb-1" />
            <div
                className="flex items-center gap-3 px-3.5 py-3.5 rounded-2xl transition-all cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, var(--color-surface-3), var(--color-bg))',
                  border: '1px solid var(--color-border)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'color-mix(in oklch, var(--color-border), var(--color-accent-1) 20%)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }}
                onClick={() => navigate(`/perfil/${usuario.nombreUsuario}`)}
            >
                {usuario.fotoPerfil ? (
                    <div className="avatar-ring shrink-0">
                      <img src={usuario.fotoPerfil} alt="Foto Perfil" className="w-10 h-10 rounded-full object-cover" />
                    </div>
                ) : (
                    <div className="avatar-ring shrink-0">
                      <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ background: 'var(--color-accent-1-dark)' }}
                      >
                          {usuario.nombreCompleto[0].toUpperCase()}
                      </div>
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate name-display" style={{color: 'var(--color-text)'}}>
                        {usuario.nombreCompleto}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--color-muted)' }}>
                        @{usuario.nombreUsuario}
                    </p>
                </div>
            </div>
            <button
                onClick={handleLogout}
                className="nav-link flex items-center gap-3.5 w-full px-4 py-2.5 rounded-2xl text-sm font-medium"
            >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Cerrar sesión
            </button>
        </div>
      )}
    </aside>
  )
}