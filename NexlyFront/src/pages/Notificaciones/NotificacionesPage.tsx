import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotificacionesStore } from '../../store/notificacionesStore'
import { useAuthStore } from '../../store/authStore'
import type { Notificacion } from '../../types'
import {
  activarPush,
  desactivarPush,
  esIOSNoInstalada,
  estadoPush,
  type EstadoPush,
} from '../../lib/push'

function IconoCampana() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function PushToggle() {
  const [estado, setEstado] = useState<EstadoPush | null>(null)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    estadoPush().then(setEstado)
  }, [])

  if (estado === null || estado === 'no-soportado') return null

  if (estado === 'denegado') {
    return (
      <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
        Notificaciones bloqueadas en el navegador
      </span>
    )
  }

  if (esIOSNoInstalada()) {
    return (
      <span className="text-xs text-right max-w-40" style={{ color: 'var(--color-muted)' }}>
        Instala Nexly (Compartir → Añadir a inicio) para recibir notificaciones
      </span>
    )
  }

  const activa = estado === 'activa'

  const toggle = async () => {
    setCargando(true)
    try {
      if (activa) {
        await desactivarPush()
        setEstado('inactiva')
      } else {
        await activarPush()
        setEstado('activa')
      }
    } catch (e) {
      setEstado(await estadoPush())
      alert(e instanceof Error ? e.message : 'No se pudo cambiar el estado de las notificaciones')
    } finally {
      setCargando(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={cargando}
      title={activa ? 'Desactivar notificaciones del navegador' : 'Activar notificaciones del navegador'}
      className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50 shrink-0"
      style={{
        color: activa ? 'var(--color-accent-1)' : 'var(--color-muted)',
        background: activa ? 'var(--color-accent-1-tint)' : 'transparent',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-accent-1-tint)')}
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = activa ? 'var(--color-accent-1-tint)' : 'transparent')
      }
    >
      <IconoCampana />
      {cargando ? '...' : activa ? 'Activadas' : 'Activar'}
    </button>
  )
}

// Etiqueta + color por tipo, para que cada notificación diga claramente qué es.
const META_TIPO: Record<Notificacion['tipo'], { label: string; color: string; bg: string }> = {
  NUEVO_SEGUIDOR:              { label: 'Nuevo seguidor', color: 'var(--color-accent-1)', bg: 'var(--color-accent-1-tint)' },
  NUEVA_REACCION_PUBLICACION:  { label: 'Reacción',       color: 'var(--color-accent-2)', bg: 'var(--color-accent-2-tint)' },
  NUEVO_COMENTARIO:            { label: 'Comentario',     color: 'var(--color-info)',     bg: 'oklch(0.94 0.04 240)' },
  NUEVA_REACCION_COMENTARIO:   { label: 'Reacción',       color: 'var(--color-accent-2)', bg: 'var(--color-accent-2-tint)' },
  NUEVO_MENSAJE:               { label: 'Mensaje',        color: 'var(--color-success)',  bg: 'oklch(0.94 0.04 148)' },
  NUEVA_SOLICITUD_SEGUIMIENTO: { label: 'Solicitud',      color: 'var(--color-warning)',  bg: 'oklch(0.94 0.05 80)' },
}

function tiempoRelativo(fecha: string): string {
  const diff = Date.now() - new Date(fecha).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'ahora'
  if (min < 60) return `${min}m`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d`
  return new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

function IconoTipoMini({ tipo }: { tipo: Notificacion['tipo'] }) {
  if (tipo === 'NUEVO_SEGUIDOR') {
    return (
      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'var(--color-accent-1)', color: '#fff' }}>
        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        </svg>
      </div>
    )
  }
  if (tipo === 'NUEVA_REACCION_PUBLICACION' || tipo === 'NUEVA_REACCION_COMENTARIO') {
    return (
      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'var(--color-accent-2)', color: '#fff' }}>
        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>
    )
  }
  if (tipo === 'NUEVA_SOLICITUD_SEGUIMIENTO') {
    return (
      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'var(--color-warning)', color: '#fff' }}>
        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
    )
  }
  if (tipo === 'NUEVO_COMENTARIO') {
    return (
      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'var(--color-info)', color: '#fff' }}>
        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
    )
  }
  return (
    <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
      style={{ background: 'var(--color-success)', color: '#fff' }}>
      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    </div>
  )
}

function getNotificacionTexto(n: Notificacion) {
  const nombre = (
    <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
      {n.emisorUsername || 'Alguien'}
    </span>
  )
  switch (n.tipo) {
    case 'NUEVO_SEGUIDOR':              return <>Te empezó a seguir {nombre}</>
    case 'NUEVO_MENSAJE':               return <>{nombre} te mandó un mensaje</>
    case 'NUEVO_COMENTARIO':            return <>{nombre} comentó tu publicación</>
    case 'NUEVA_REACCION_PUBLICACION':  return <>{nombre} reaccionó a tu publicación</>
    case 'NUEVA_REACCION_COMENTARIO':   return <>{nombre} reaccionó a tu comentario</>
    case 'NUEVA_SOLICITUD_SEGUIMIENTO': return <>{nombre} quiere seguirte</>
  }
}

function NotificacionItem({ n, index = 0 }: { n: Notificacion; index?: number }) {
  const marcarLeida = useNotificacionesStore((s) => s.marcarLeida)
  const navigate = useNavigate()
  const miUsername = useAuthStore((s) => s.usuario?.nombreUsuario)

  const onClick = () => {
    marcarLeida(n.id)
    // Navega a "lo que la notificación es" cuando hay destino claro.
    switch (n.tipo) {
      case 'NUEVA_SOLICITUD_SEGUIMIENTO':
        if (miUsername) navigate(`/perfil/${miUsername}?tab=solicitudes`)
        break
      case 'NUEVO_SEGUIDOR':
        if (n.emisorUsername) navigate(`/perfil/${n.emisorUsername}`)
        break
      case 'NUEVO_MENSAJE':
        navigate('/chat')
        break
      // Reacciones/comentarios: sin página de post individual, se quedan aquí.
    }
  }

  return (
    <div
      onClick={onClick}
      className="row-enter flex items-start gap-3 px-4 sm:px-5 py-4 cursor-pointer transition-colors"
      style={{
        background: n.leida ? 'transparent' : 'var(--color-accent-1-tint)',
        borderBottom: '1px solid var(--color-border)',
        animationDelay: `${index * 0.03}s`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = n.leida
          ? 'var(--color-surface-2)'
          : 'oklch(0.93 0.04 275)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = n.leida
          ? 'transparent'
          : 'var(--color-accent-1-tint)'
      }}
    >
      {/* Avatar del emisor */}
      <div className="relative shrink-0">
        {n.emisorFotoPerfil ? (
          <img src={n.emisorFotoPerfil} alt={n.emisorUsername ?? ''} className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm uppercase" style={{ background: 'var(--color-accent-1)' }}>
            {(n.emisorUsername || 'A')[0]}
          </div>
        )}
        <div className="absolute -bottom-1 -right-1 rounded-full border-2" style={{ borderColor: 'var(--color-surface)' }}>
          <IconoTipoMini tipo={n.tipo} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0"
            style={{ color: META_TIPO[n.tipo].color, background: META_TIPO[n.tipo].bg }}
          >
            {META_TIPO[n.tipo].label}
          </span>
          <span className="text-xs shrink-0" style={{ color: 'var(--color-muted)' }}>
            {tiempoRelativo(n.fechaCreacion)}
          </span>
        </div>
        <p className="text-sm leading-snug" style={{ color: 'var(--color-text)' }}>
          {getNotificacionTexto(n)}
        </p>
      </div>

      {!n.leida && (
        <div
          className="w-2 h-2 rounded-full shrink-0 mt-1.5"
          style={{ background: 'var(--color-accent-1)' }}
        />
      )}
    </div>
  )
}

export default function NotificacionesPage() {
  const { notificaciones, noLeidas, loading, hayMas, cargar, cargarMas, marcarTodasLeidas } =
    useNotificacionesStore()

  useEffect(() => {
    cargar()
  }, [cargar])

  return (
    <div className="pb-20 sm:pb-0">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 px-4 sm:px-5 py-4 sticky top-0 z-10 rounded-none sm:rounded-t-2xl"
        style={{
          background: 'color-mix(in oklch, var(--color-surface) 82%, transparent)',
          backdropFilter: 'blur(14px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(14px) saturate(1.5)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="flex items-center justify-between sm:block">
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
              Notificaciones
            </h1>
            {noLeidas > 0 && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                {noLeidas} sin leer
              </p>
            )}
          </div>
          {noLeidas > 0 && (
            <button
              onClick={marcarTodasLeidas}
              className="sm:hidden text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--color-accent-1)', background: 'var(--color-accent-1-tint)' }}
            >
              Marcar leídas
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <PushToggle />
          {noLeidas > 0 && (
            <button
              onClick={marcarTodasLeidas}
              className="hidden sm:block text-sm font-semibold px-3 py-1.5 rounded-xl transition-colors"
              style={{ color: 'var(--color-accent-1)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-accent-1-tint)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      {/* Lista */}
      <div
        className="rounded-none sm:rounded-b-2xl overflow-hidden"
        style={{
          background: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border)',
          borderRight: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {loading && notificaciones.length === 0 ? (
          <div className="flex flex-col gap-3 p-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-9 h-9 rounded-full shrink-0" style={{ background: 'var(--color-border)' }} />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-3 rounded-full w-3/4" style={{ background: 'var(--color-border)' }} />
                  <div className="h-2 rounded-full w-1/4" style={{ background: 'var(--color-border)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : notificaciones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'var(--color-accent-1-tint)' }}
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ color: 'var(--color-accent-1)' }}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <p className="font-semibold" style={{ color: 'var(--color-text)' }}>Sin notificaciones</p>
            <p className="text-sm text-center max-w-xs" style={{ color: 'var(--color-muted)' }}>
              Cuando alguien interactúe con tu contenido, lo verás aquí.
            </p>
          </div>
        ) : (
          <>
            {notificaciones.map((n, i) => (
              <NotificacionItem key={n.id} n={n} index={i} />
            ))}

            {hayMas && (
              <div className="p-4 flex justify-center">
                <button
                  onClick={cargarMas}
                  disabled={loading}
                  className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                  style={{ color: 'var(--color-accent-1)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-accent-1-tint)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {loading ? 'Cargando...' : 'Ver más'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
