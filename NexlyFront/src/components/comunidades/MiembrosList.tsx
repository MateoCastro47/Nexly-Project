import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useComunidadesStore } from '../../store/comunidadesStore'
import type { MiembroComunidad, RolComunidad } from '../../types'

function colorRol(rol: RolComunidad): { bg: string; fg: string } {
  if (rol === 'ADMIN') return { bg: 'var(--color-accent-2-tint)', fg: 'var(--color-accent-2)' }
  if (rol === 'MOD') return { bg: 'var(--color-accent-1-tint)', fg: 'var(--color-accent-1)' }
  return { bg: 'var(--color-surface-3)', fg: 'var(--color-muted)' }
}

function MiembroItem({ m, esAdmin }: { m: MiembroComunidad; esAdmin: boolean }) {
  const navigate = useNavigate()
  const { cambiarRolMiembro, banearMiembro } = useComunidadesStore()
  const c = colorRol(m.rol)

  return (
    <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
      <button onClick={() => navigate(`/perfil/${m.nombreUsuario}`)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
        {m.fotoPerfil ? (
          <img src={m.fotoPerfil} className="w-10 h-10 rounded-full object-cover shrink-0" alt="" />
        ) : (
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: 'var(--color-accent-1-dark)' }}>
            {m.nombreUsuario[0].toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>@{m.nombreUsuario}</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5" style={{ background: c.bg, color: c.fg }}>{m.rol}</span>
        </div>
      </button>

      {esAdmin && m.rol !== 'ADMIN' && (
        <div className="flex gap-1 shrink-0">
          <select value={m.rol} onChange={(e) => cambiarRolMiembro(m.usuarioId, e.target.value as RolComunidad)}
            className="text-xs px-2 py-1 rounded-lg outline-none"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
            <option value="MIEMBRO">Miembro</option>
            <option value="MOD">Moderador</option>
          </select>
          <button onClick={() => { if (confirm(`¿Banear a @${m.nombreUsuario}?`)) banearMiembro(m.usuarioId, true) }}
            className="text-xs px-2 py-1 rounded-lg font-semibold"
            style={{ color: 'var(--color-error)', background: 'oklch(0.62 0.24 28 / 0.08)' }}>Banear</button>
        </div>
      )}
    </div>
  )
}

export default function MiembrosList({ esAdmin }: { esAdmin: boolean }) {
  const { miembros, loadingMiembros, hayMasMiembros, cargarMiembros, cargarMasMiembros } = useComunidadesStore()

  useEffect(() => { cargarMiembros() }, [cargarMiembros])

  if (loadingMiembros && miembros.length === 0) {
    return (
      <div className="flex flex-col gap-3 p-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-full shrink-0" style={{ background: 'var(--color-border)' }} />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-3 rounded-full w-1/3" style={{ background: 'var(--color-border)' }} />
              <div className="h-2 rounded-full w-1/5" style={{ background: 'var(--color-border)' }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (miembros.length === 0) {
    return <p className="px-5 py-10 text-center text-sm" style={{ color: 'var(--color-muted)' }}>Sin miembros aún</p>
  }

  return (
    <>
      {miembros.map((m) => <MiembroItem key={m.usuarioId} m={m} esAdmin={esAdmin} />)}
      {hayMasMiembros && (
        <div className="p-4 flex justify-center">
          <button onClick={cargarMasMiembros} disabled={loadingMiembros}
            className="text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-50"
            style={{ color: 'var(--color-accent-1)' }}>
            {loadingMiembros ? 'Cargando…' : 'Ver más'}
          </button>
        </div>
      )}
    </>
  )
}
