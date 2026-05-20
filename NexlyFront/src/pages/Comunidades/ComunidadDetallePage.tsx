import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useComunidadesStore } from '../../store/comunidadesStore'
import ComunidadHeader from '../../components/comunidades/ComunidadHeader'
import MiembrosList from '../../components/comunidades/MiembrosList'
import PostCard from '../../components/feed/PostCard'
import CreatePost from '../../components/feed/CreatePost'
import type { TipoReaccion } from '../../types'
import { reaccionar, quitarReaccion, eliminarPublicacion } from '../../api/Publicaciones'
import SolicitudesPendientesList from '../../components/comunidades/SolicitudesPendientes'

type Tab = 'feed' | 'miembros' | 'solicitudes'

export default function ComunidadDetallePage() {
  const { id } = useParams<{ id: string }>()
  const comunidadId = Number(id)
  const {
    actual, loadingDetalle, errorDetalle,
    publicaciones, loadingPosts, hayMasPosts,
    cargarDetalle, limpiarDetalle, toggleMembresia,
    cargarPosts, cargarMasPosts,
    agregarPublicacion,
  } = useComunidadesStore()

  const [tab, setTab] = useState<Tab>('feed')
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!Number.isFinite(comunidadId)) return
    cargarDetalle(comunidadId)
    return () => limpiarDetalle()
  }, [comunidadId, cargarDetalle, limpiarDetalle])

  useEffect(() => {
    if (actual && tab === 'feed') cargarPosts()
  }, [actual, tab, cargarPosts])

  useEffect(() => {
    if (tab !== 'feed') return
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) cargarMasPosts() }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [tab, cargarMasPosts, publicaciones.length])

  if (errorDetalle === '404') {
    return (
      <div className="flex flex-col items-center py-24 gap-4 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{ background: 'var(--color-accent-1-tint)' }}>🚫</div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>Comunidad no encontrada</h2>
        <Link to="/comunidades" className="mt-2 px-5 py-2 text-sm font-semibold rounded-full text-white" style={{ background: 'var(--gradient-brand)' }}>Volver a comunidades</Link>
      </div>
    )
  }

  if (errorDetalle) {
    return (
      <div className="text-sm text-center py-8 px-4 rounded-2xl mt-6"
        style={{ color: 'var(--color-error)', background: 'oklch(0.62 0.24 28 / 0.06)', border: '1px solid oklch(0.62 0.24 28 / 0.15)' }}>
        {errorDetalle}
      </div>
    )
  }

  if (loadingDetalle || !actual) {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-3xl overflow-hidden animate-pulse" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="h-32" style={{ background: 'var(--color-border)' }} />
          <div className="px-5 pb-5">
            <div className="w-20 h-20 rounded-2xl -mt-10 mb-4" style={{ background: 'var(--color-border)' }} />
            <div className="h-5 w-40 rounded-full mb-2" style={{ background: 'var(--color-border)' }} />
            <div className="h-3 w-24 rounded-full" style={{ background: 'var(--color-border)' }} />
          </div>
        </div>
      </div>
    )
  }

  const esAdmin = actual.miRol === 'ADMIN' || actual.miRol === 'MOD' || actual.esCreador
  const muestraSolicitudes = esAdmin && !actual.esPublica
  const puedePublicar = actual.esMiembro || actual.esCreador

  const handleToggleReaccion = async (postId: number, tipo: TipoReaccion) => {
    const post = publicaciones.find((p) => p.id === postId)
    if (!post) return
    const actualR = post.reaccionDelVisor
    const quitando = actualR === tipo

    useComunidadesStore.setState((s) => ({
      publicaciones: s.publicaciones.map((p) => {
        if (p.id !== postId) return p
        return {
          ...p,
          reaccionDelVisor: quitando ? undefined : tipo,
          conteoReacciones: quitando ? p.conteoReacciones - 1 : actualR ? p.conteoReacciones : p.conteoReacciones + 1,
        }
      }),
    }))

    try {
      if (quitando) await quitarReaccion(postId)
      else await reaccionar(postId, tipo)
    } catch {
      useComunidadesStore.setState((s) => ({ publicaciones: s.publicaciones.map((p) => (p.id === postId ? post : p)) }))
    }
  }

  const handleEliminar = async (postId: number) => {
    await eliminarPublicacion(postId)
    useComunidadesStore.setState((s) => ({ publicaciones: s.publicaciones.filter((p) => p.id !== postId) }))
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'feed', label: 'Publicaciones' },
    { key: 'miembros', label: 'Miembros' },
    ...(muestraSolicitudes ? [{ key: 'solicitudes' as Tab, label: 'Solicitudes' }] : []),
  ]

  return (
    <div className="flex flex-col gap-5">
      <ComunidadHeader comunidad={actual} onToggleMembresia={toggleMembresia} />

      <div className="flex" style={{ borderBottom: '1px solid var(--color-border)' }}>
        {tabs.map(({ key, label }) => {
          const isActive = tab === key
          return (
            <button key={key} onClick={() => setTab(key)}
              className="flex-1 py-3 text-sm font-semibold transition-colors relative"
              style={{ color: isActive ? 'var(--color-accent-1)' : 'var(--color-muted)' }}>
              {label}
              {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-3/4 rounded-full" style={{ background: 'var(--gradient-brand)' }} />}
            </button>
          )
        })}
      </div>

      {tab === 'feed' && (
        <>
          {puedePublicar && (
            <CreatePost
              comunidadId={actual.id}
              comunidadNombre={actual.nombre}
              onCreated={agregarPublicacion}
            />
          )}
          {publicaciones.map((p) => (
            <PostCard key={p.id} publicacion={p} onEliminar={() => handleEliminar(p.id)} onToggleReaccion={handleToggleReaccion} />
          ))}
          {loadingPosts && <p className="text-center text-sm" style={{ color: 'var(--color-muted)' }}>Cargando…</p>}
          {!loadingPosts && publicaciones.length === 0 && (
            <p className="text-center py-12 text-sm" style={{ color: 'var(--color-muted)' }}>Aún no hay publicaciones en esta comunidad.</p>
          )}
          {hayMasPosts && <div ref={sentinelRef} className="h-4" />}
        </>
      )}

      {tab === 'miembros' && (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <MiembrosList esAdmin={esAdmin} />
        </div>
      )}

      {tab === 'solicitudes' && (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <SolicitudesPendientesList />
        </div>
      )}
    </div>
  )
}
