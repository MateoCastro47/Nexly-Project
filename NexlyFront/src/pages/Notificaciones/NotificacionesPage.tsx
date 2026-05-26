import { useEffect, useState } from 'react'
import { useNotificacionesStore } from '../../store/notificacionesStore'
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

function IconoTipo({ tipo }: { tipo: Notificacion['tipo'] }) {
  if (tipo === 'NUEVO_SEGUIDOR') {
    return (
      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'var(--color-accent-1-tint)', color: 'var(--color-accent-1)' }}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      </div>
    )
  }
  if (tipo === 'NUEVA_REACCION_PUBLICACION') {
    return (
      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'var(--color-accent-2-tint)', color: 'var(--color-accent-2)' }}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>
    )
  }
  if (tipo === 'NUEVO_COMENTARIO') {
    return (
      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'oklch(0.94 0.04 240)', color: 'var(--color-info)' }}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
    )
  }
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
      style={{ background: 'oklch(0.94 0.04 148)', color: 'var(--color-success)' }}>
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    </div>
  )
}

function NotificacionItem({ n }: { n: Notificacion }) {
  const marcarLeida = useNotificacionesStore((s) => s.marcarLeida)

  return (
    <div
      onClick={() => marcarLeida(n.id)}
      className="flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors"
      style={{
        background: n.leida ? 'transparent' : 'var(--color-accent-1-tint)',
        borderBottom: '1px solid var(--color-border)',
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
      {/* Avatar del emisor o icono de tipo */}
      {n.emisorFoto ? (
        <div className="relative shrink-0">
          <img src={n.emisorFoto} alt={n.emisorNombre} className="w-9 h-9 rounded-full object-cover" />
          <div className="absolute -bottom-0.5 -right-0.5">
            <IconoTipo tipo={n.tipo} />
          </div>
        </div>
      ) : (
        <IconoTipo tipo={n.tipo} />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug" style={{ color: 'var(--color-text)' }}>
          {n.contenido}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
          {tiempoRelativo(n.fechaCreacion)}
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
    <div>
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 sticky top-0 z-10"
        style={{
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
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

        <div className="flex items-center gap-2">
          <PushToggle />
          {noLeidas > 0 && (
            <button
              onClick={marcarTodasLeidas}
              className="text-sm font-semibold px-3 py-1.5 rounded-xl transition-colors"
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
        className="rounded-b-2xl overflow-hidden"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderTop: 'none',
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
            {notificaciones.map((n) => (
              <NotificacionItem key={n.id} n={n} />
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
