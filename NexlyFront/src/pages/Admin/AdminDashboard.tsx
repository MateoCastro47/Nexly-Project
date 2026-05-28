import { useEffect, useState } from 'react'
import {
  getStats, getUsuarios, getPublicaciones,
  type AdminStats, type AdminUsuario, type AdminPublicacion,
} from '../../api/admin'

const surfaceCard = {
  background: 'linear-gradient(165deg, var(--color-surface), var(--color-surface-2))',
  border: '1px solid var(--color-border)',
  boxShadow: 'var(--shadow-sm)',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [usuarios, setUsuarios] = useState<AdminUsuario[]>([])
  const [publicaciones, setPublicaciones] = useState<AdminPublicacion[]>([])

  useEffect(() => {
    getStats().then((r) => setStats(r.data)).catch(() => {})
    getUsuarios('', 0, 5).then((r) => setUsuarios(r.data.content)).catch(() => {})
    getPublicaciones(0, 5).then((r) => setPublicaciones(r.data.content)).catch(() => {})
  }, [])

  const cards = stats ? [
    { label: 'Usuarios', value: stats.usuarios, sub: `${stats.usuariosActivos} activos`, dot: 'var(--color-accent-1)' },
    { label: 'Verificados', value: stats.usuariosVerificados, sub: `de ${stats.usuarios}`, dot: 'var(--color-brand)' },
    { label: 'Nuevos (7 días)', value: stats.nuevosUsuarios7d, dot: 'var(--color-accent-2)' },
    { label: 'Publicaciones', value: stats.publicaciones, dot: 'var(--color-accent-1)' },
    { label: 'Comunidades', value: stats.comunidades, sub: `${stats.comunidadesPublicas} públicas`, dot: 'var(--color-brand)' },
    { label: 'Comentarios', value: stats.comentarios, dot: 'var(--color-accent-2)' },
    { label: 'Reacciones', value: stats.reacciones, dot: 'var(--color-accent-1)' },
  ] : []

  const tipos = stats ? Object.entries(stats.publicacionesPorTipo) : []
  const maxTipo = Math.max(1, ...tipos.map(([, n]) => n))

  return (
    <div className="flex flex-col gap-8">
      {/* ── Tarjetas de métricas ── */}
      <section>
        <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Resumen
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {(stats ? cards : Array.from({ length: 7 }, () => null)).map((c, i) => (
            <div
              key={c?.label ?? i}
              className="rounded-2xl p-4 transition-all hover:-translate-y-0.5"
              style={surfaceCard}
            >
              <span
                className="inline-block w-2 h-2 rounded-full mb-2"
                style={{ background: c?.dot ?? 'var(--color-border)' }}
              />
              <p className="text-2xl font-bold leading-none" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-brand)' }}>
                {c ? c.value : '—'}
              </p>
              <p className="text-xs mt-1.5 font-semibold" style={{ color: 'var(--color-text)' }}>
                {c?.label ?? ' '}
              </p>
              {c?.sub && <p className="text-[0.7rem]" style={{ color: 'var(--color-muted)' }}>{c.sub}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Publicaciones por tipo (barras CSS) ── */}
      <section className="rounded-3xl p-6" style={surfaceCard}>
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          <span className="inline-block w-1.5 h-4 rounded-full" style={{ background: 'var(--gradient-brand)' }} />
          Publicaciones por tipo
        </h3>
        <div className="flex flex-col gap-3.5">
          {tipos.map(([tipo, n]) => (
            <div key={tipo} className="flex items-center gap-3">
              <span className="text-xs w-24 shrink-0 font-medium" style={{ color: 'var(--color-muted)' }}>{tipo}</span>
              <div className="flex-1 h-3.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-3, var(--color-bg))' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(n / maxTipo) * 100}%`, background: 'var(--gradient-brand)', minWidth: n > 0 ? '0.5rem' : 0 }}
                />
              </div>
              <span className="text-xs w-8 text-right font-bold" style={{ color: 'var(--color-text)' }}>{n}</span>
            </div>
          ))}
          {tipos.length === 0 && <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Sin datos.</p>}
        </div>
      </section>

      {/* ── Actividad reciente ── */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl p-6" style={surfaceCard}>
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            <span className="inline-block w-1.5 h-4 rounded-full" style={{ background: 'var(--color-accent-1)' }} />
            Últimos usuarios
          </h3>
          <ul className="flex flex-col gap-3">
            {usuarios.map((u) => (
              <li key={u.id} className="flex items-center justify-between text-sm">
                <span className="min-w-0 truncate" style={{ color: 'var(--color-text)' }}>
                  {u.nombreCompleto} <span style={{ color: 'var(--color-muted)' }}>@{u.nombreUsuario}</span>
                </span>
                <span className="text-xs shrink-0 ml-3" style={{ color: 'var(--color-muted)' }}>
                  {new Date(u.fechaRegistro).toLocaleDateString()}
                </span>
              </li>
            ))}
            {usuarios.length === 0 && <li className="text-xs" style={{ color: 'var(--color-muted)' }}>Sin usuarios.</li>}
          </ul>
        </div>

        <div className="rounded-3xl p-6" style={surfaceCard}>
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            <span className="inline-block w-1.5 h-4 rounded-full" style={{ background: 'var(--color-accent-2)' }} />
            Últimas publicaciones
          </h3>
          <ul className="flex flex-col gap-3">
            {publicaciones.map((p) => (
              <li key={p.id} className="text-sm">
                <span className="block truncate" style={{ color: 'var(--color-text)' }}>{p.contenido}</span>
                <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                  @{p.autorUsername} · {new Date(p.fechaCreacion).toLocaleDateString()}
                </span>
              </li>
            ))}
            {publicaciones.length === 0 && <li className="text-xs" style={{ color: 'var(--color-muted)' }}>Sin publicaciones.</li>}
          </ul>
        </div>
      </section>
    </div>
  )
}
