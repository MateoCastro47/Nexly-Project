import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useComunidadesStore } from '../../store/comunidadesStore'

export default function SolicitudesPendientesList() {
  const navigate = useNavigate()
  const { pendientes, loadingPendientes, pendientesProhibidas, cargarPendientes, aceptarSolicitud, rechazarSolicitud } = useComunidadesStore()

  useEffect(() => { cargarPendientes() }, [cargarPendientes])

  if (pendientesProhibidas) {
    return <p className="px-5 py-10 text-center text-sm" style={{ color: 'var(--color-muted)' }}>Solo los administradores y moderadores pueden ver las solicitudes.</p>
  }
  if (loadingPendientes) {
    return <div className="px-5 py-10 text-center text-sm" style={{ color: 'var(--color-muted)' }}>Cargando…</div>
  }
  if (pendientes.length === 0) {
    return <p className="px-5 py-10 text-center text-sm" style={{ color: 'var(--color-muted)' }}>No hay solicitudes pendientes.</p>
  }

  return (
    <>
      {pendientes.map((m) => (
        <div key={m.usuarioId} className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <button onClick={() => navigate(`/perfil/${m.nombreUsuario}`)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
            {m.fotoPerfil ? (
              <img src={m.fotoPerfil} className="w-10 h-10 rounded-full object-cover shrink-0" alt="" />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: 'var(--color-accent-1-dark)' }}>
                {m.nombreUsuario[0].toUpperCase()}
              </div>
            )}
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>@{m.nombreUsuario}</p>
          </button>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => aceptarSolicitud(m.usuarioId)} className="px-3 py-1.5 text-xs font-semibold rounded-full text-white" style={{ background: 'var(--gradient-brand)' }}>Aceptar</button>
            <button onClick={() => rechazarSolicitud(m.usuarioId)} className="px-3 py-1.5 text-xs font-semibold rounded-full" style={{ color: 'var(--color-muted)', border: '1.5px solid var(--color-border)' }}>Rechazar</button>
          </div>
        </div>
      ))}
    </>
  )
}
