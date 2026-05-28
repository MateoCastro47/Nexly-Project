import { useEffect, useRef, useState } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { usePerfilStore } from '../../store/perfilStore'
import PostCard from '../../components/feed/PostCard'
import EditarPerfilModal from '../../components/perfil/EditarPerfilModal'
import type { SolicitudSeguimiento } from '../../types'
import { getSolicitudesPendientes, aceptarSolicitud, rechazarSolicitud } from '../../api/seguimiento'

type Tab = 'posts' | 'replies' | 'likes' | 'solicitudes'

const esUrlValida = (url?: string) => !!url && url.startsWith('http')

function PostsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-3xl p-5 flex flex-col gap-4"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center gap-3">
            <div className="skeleton w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="skeleton h-3.5 w-32 rounded-full" />
              <div className="skeleton h-3 w-20 rounded-full" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="skeleton h-3 w-full rounded-full" />
            <div className="skeleton h-3 w-4/5 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

function HeaderSkeleton() {
  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(165deg, var(--color-surface), var(--color-surface-2))',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="skeleton h-40 w-full rounded-none" />
      <div className="px-5 pb-5">
        <div className="flex justify-between items-start -mt-8 mb-4">
          <div className="skeleton w-20 h-20 rounded-full" style={{ border: '4px solid var(--color-surface)' }} />
          <div className="skeleton h-9 w-28 rounded-full mt-10" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="skeleton h-5 w-40 rounded-full" />
          <div className="skeleton h-4 w-24 rounded-full" />
          <div className="skeleton h-3.5 w-64 rounded-full mt-1" />
          <div className="flex gap-4 mt-1">
            <div className="skeleton h-3.5 w-24 rounded-full" />
            <div className="skeleton h-3.5 w-24 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

function PerfilNoEncontrado() {
  return (
    <div className="flex flex-col items-center py-24 gap-4 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
        style={{ background: 'var(--color-accent-1-tint)' }}
      >
        👤
      </div>
      <h2
        className="text-lg font-bold"
        style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}
      >
        Usuario no encontrado
      </h2>
      <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
        Esta cuenta no existe o fue eliminada.
      </p>
      <Link
        to="/"
        className="mt-2 px-5 py-2 text-sm font-semibold rounded-full text-white"
        style={{ background: 'var(--gradient-brand)' }}
      >
        Volver al feed
      </Link>
    </div>
  )
}

function EmptyPosts({ nombre }: { nombre: string }) {
  return (
    <div className="flex flex-col items-center py-16 gap-3 text-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
        style={{ background: 'var(--color-accent-1-tint)' }}
      >
        ✍️
      </div>
      <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
        {nombre} aún no ha publicado nada
      </p>
    </div>
  )
}

export default function ProfilePage() {
  const { nombreUsuario } = useParams<{ nombreUsuario: string }>()
  const authUsuario = useAuthStore((s) => s.usuario)
  const {
    usuario, publicaciones, loading, loadingPosts, error, hayMas,
    cargarPerfil, cargarMasPosts, toggleSeguir, toggleReaccion, eliminar,
  } = usePerfilStore()

  const [activeTab, setActiveTab] = useState<Tab>('posts')
  const [fotoError, setFotoError] = useState(false)
  const [portadaError, setPortadaError] = useState(false)
  const [editando, setEditando] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [searchParams] = useSearchParams()
  const [solicitudes, setSolicitudes] = useState<SolicitudSeguimiento[]>([])
  const [loadingSolic, setLoadingSolic] = useState(false)

  const esPropio = authUsuario?.nombreUsuario === nombreUsuario
  const mostrarSolicitudes = esPropio && !!usuario?.perfilPrivado

  useEffect(() => {
    if (!nombreUsuario) return
    setFotoError(false)
    setPortadaError(false)
    setActiveTab('posts')
    cargarPerfil(nombreUsuario)
  }, [nombreUsuario, cargarPerfil])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) cargarMasPosts() },
      { threshold: 0.1 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [cargarMasPosts, publicaciones.length])

  // Si la URL trae ?tab=solicitudes (desde la notificación), activa el tab.
  useEffect(() => {
    if (mostrarSolicitudes && searchParams.get('tab') === 'solicitudes') {
      setActiveTab('solicitudes')
    }
  }, [mostrarSolicitudes, searchParams])

  // Carga las solicitudes pendientes al entrar al tab.
  useEffect(() => {
    if (activeTab !== 'solicitudes' || !mostrarSolicitudes) return
    setLoadingSolic(true)
    getSolicitudesPendientes()
      .then(({ data }) => setSolicitudes(data))
      .finally(() => setLoadingSolic(false))
  }, [activeTab, mostrarSolicitudes])

  const onAceptarSolic = async (id: number) => {
    setSolicitudes((prev) => prev.filter((s) => s.seguidorId !== id))
    try { await aceptarSolicitud(id) } catch { /* TODO: revert + toast */ }
  }
  const onRechazarSolic = async (id: number) => {
    setSolicitudes((prev) => prev.filter((s) => s.seguidorId !== id))
    try { await rechazarSolicitud(id) } catch { /* TODO: revert + toast */ }
  }

  if (error === '404') return <PerfilNoEncontrado />

  if (error) {
    return (
      <div
        className="text-sm text-center py-8 px-4 rounded-2xl mt-6"
        style={{
          color: 'var(--color-error)',
          background: 'oklch(0.62 0.24 28 / 0.06)',
          border: '1px solid oklch(0.62 0.24 28 / 0.15)',
        }}
      >
        {error}
      </div>
    )
  }

  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: 'posts', label: 'Publicaciones' },
    { key: 'replies', label: 'Respuestas' },
    { key: 'likes', label: 'Me gusta' },
    ...(mostrarSolicitudes
      ? [{ key: 'solicitudes' as Tab, label: 'Solicitudes', badge: solicitudes.length }]
      : []),
  ]

  const mostrarPortada = esUrlValida(usuario?.fotoPortada) && !portadaError

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header card ── */}
      {loading ? <HeaderSkeleton /> : (
        <div
          className="rounded-3xl overflow-visible"
          style={{
            background: 'linear-gradient(165deg, var(--color-surface), var(--color-surface-2))',
            border: '1px solid color-mix(in oklch, var(--color-border), var(--color-accent-1) 8%)',
            boxShadow: 'var(--shadow-card)',
            animation: 'fadeInUp 0.5s cubic-bezier(0.19, 1, 0.22, 1) both',
          }}
        >
          {/* Portada */}
          <div className="h-40 rounded-t-3xl overflow-hidden">
            {mostrarPortada ? (
              <img
                src={usuario!.fotoPortada}
                alt=""
                className="w-full h-full object-cover"
                onError={() => setPortadaError(true)}
              />
            ) : (
              <div
                className="w-full h-full"
                style={{ background: 'var(--gradient-brand-vivid)', backgroundSize: '300% 300%', animation: 'gradientShift 6s ease infinite' }}
              />
            )}
          </div>

          {/* Avatar + botón + info */}
          <div className="px-5 pb-5">
            {/* Fila avatar / botón */}
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="avatar-ring avatar-hero shrink-0" style={{ padding: '3px' }}>
                <div className="w-20 h-20 rounded-full overflow-hidden" style={{ background: 'var(--color-surface)' }}>
                  {esUrlValida(usuario?.fotoPerfil) && !fotoError ? (
                    <img
                      src={usuario!.fotoPerfil}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={() => setFotoError(true)}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
                      style={{ background: 'var(--color-accent-1-dark)' }}
                    >
                      {usuario?.nombreCompleto?.[0]?.toUpperCase() ?? '?'}
                    </div>
                  )}
                </div>
              </div>

              {esPropio ? (
                <button
                  onClick={() => setEditando(true)}
                  className="px-5 py-2 text-sm font-semibold rounded-full transition-all"
                  style={{
                    border: '1.5px solid var(--color-border)',
                    color: 'var(--color-text)',
                    background: 'transparent',
                  }}
                >
                  Editar perfil
                </button>
              ) : (
                <button
                  onClick={toggleSeguir}
                  className="px-5 py-2 text-sm font-semibold rounded-full transition-all"
                  style={usuario?.siguiendo ? {
                    color: 'var(--color-muted)',
                    border: '1.5px solid var(--color-border)',
                    background: 'transparent',
                  } : {
                    color: 'white',
                    background: 'var(--gradient-brand)',
                    border: '1.5px solid transparent',
                  }}
                >
                  {usuario?.siguiendo ? 'Siguiendo' : 'Seguir'}
                </button>
              )}
            </div>

            {/* Datos del usuario */}
            {usuario && (
              <div className="flex flex-col gap-2">
                <div>
                  <h1
                    className="text-xl font-bold leading-tight"
                    style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}
                  >
                    {usuario.nombreCompleto}
                  </h1>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted)' }}>
                    @{usuario.nombreUsuario}
                  </p>
                </div>

                {usuario.biografia && (
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
                    {usuario.biografia}
                  </p>
                )}

                <div className="flex gap-5 text-sm pt-1">
                  <span>
                    <span className="font-bold" style={{ color: 'var(--color-text)' }}>
                      {usuario.seguidores}
                    </span>{' '}
                    <span style={{ color: 'var(--color-muted)' }}>seguidores</span>
                  </span>
                  <span>
                    <span className="font-bold" style={{ color: 'var(--color-text)' }}>
                      {usuario.seguidos}
                    </span>{' '}
                    <span style={{ color: 'var(--color-muted)' }}>seguidos</span>
                  </span>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="mt-5 flex" style={{ borderBottom: '1px solid var(--color-border)' }}>
              {tabs.map(({ key, label, badge }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`tab-underline ${activeTab === key ? 'tab-underline-active' : ''}`}
                >
                  {label}
                  {badge != null && badge > 0 && (
                    <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full align-middle"
                      style={{ background: 'var(--color-accent-1)', color: 'white' }}>
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Contenido ── */}
      {activeTab === 'posts' ? (
        <>
          {publicaciones.map((p, i) => (
            <PostCard
              key={p.id}
              publicacion={p}
              variant={i % 7 === 0 ? 'hero' : 'normal'}
              onEliminar={() => eliminar(p.id)}
              onToggleReaccion={toggleReaccion}
            />
          ))}

          {loadingPosts && <PostsSkeleton />}

          {!loadingPosts && !loading && publicaciones.length === 0 && usuario && (
            <EmptyPosts nombre={usuario.nombreCompleto} />
          )}

          {!loadingPosts && !hayMas && publicaciones.length > 0 && (
            <div className="flex justify-center py-8">
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                No hay más publicaciones
              </p>
            </div>
          )}

          {hayMas && <div ref={sentinelRef} className="h-4" />}

          {editando && usuario && (
            <EditarPerfilModal usuario={usuario} onClose={() => setEditando(false)} />
          )}
        </>
      ) : activeTab === 'solicitudes' ? (
        <div
          className="rounded-3xl overflow-hidden"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          {loadingSolic ? (
            <div className="flex flex-col gap-3 p-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-11 h-11 rounded-full shrink-0" style={{ background: 'var(--color-border)' }} />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="h-3 rounded-full w-1/3" style={{ background: 'var(--color-border)' }} />
                    <div className="h-2 rounded-full w-1/4" style={{ background: 'var(--color-border)' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : solicitudes.length === 0 ? (
            <div className="flex flex-col items-center py-14 gap-2 text-center px-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'oklch(0.94 0.05 80)', color: 'var(--color-warning)' }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Sin solicitudes pendientes</p>
              <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                Cuando alguien quiera seguirte, lo verás aquí.
              </p>
            </div>
          ) : (
            solicitudes.map((s, i) => (
              <div key={s.seguidorId} className="row-enter flex items-center gap-3 px-5 py-4"
                style={{ borderBottom: '1px solid var(--color-border)', animationDelay: `${i * 0.04}s` }}>
                <Link to={`/perfil/${s.nombreUsuario}`} className="shrink-0">
                  {s.fotoPerfil ? (
                    <img src={s.fotoPerfil} alt="" className="w-11 h-11 rounded-full object-cover" />
                  ) : (
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: 'var(--gradient-brand)' }}>
                      {s.nombreCompleto[0]?.toUpperCase() ?? '?'}
                    </div>
                  )}
                </Link>
                <Link to={`/perfil/${s.nombreUsuario}`} className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>{s.nombreCompleto}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--color-muted)' }}>@{s.nombreUsuario}</p>
                </Link>
                <button
                  onClick={() => onAceptarSolic(s.seguidorId)}
                  className="px-4 py-1.5 text-xs font-semibold rounded-full text-white transition-transform active:scale-95"
                  style={{ background: 'var(--gradient-brand)' }}
                >
                  Aceptar
                </button>
                <button
                  onClick={() => onRechazarSolic(s.seguidorId)}
                  className="px-4 py-1.5 text-xs font-semibold rounded-full transition-colors"
                  style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text-2)', background: 'transparent' }}
                >
                  Rechazar
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div
          className="rounded-3xl p-10 flex flex-col items-center gap-3"
          style={{
            background: 'linear-gradient(165deg, var(--color-surface), var(--color-surface-2))',
            border: '1px solid var(--color-border)',
          }}
        >
          <p className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
            {activeTab === 'replies' ? 'Respuestas próximamente' : 'Me gusta próximamente'}
          </p>
        </div>
      )}
    </div>
  )
}
