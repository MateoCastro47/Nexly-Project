import { useCallback, useEffect, useState } from 'react'
import { getComunidades, eliminarComunidad, type AdminComunidad } from '../../api/admin'
import Paginacion from './Paginacion'

export default function AdminComunidades() {
  const [items, setItems] = useState<AdminComunidad[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const cargar = useCallback(() => {
    getComunidades(page, 20).then((r) => {
      setItems(r.data.content)
      setTotalPages(r.data.totalPages)
    })
  }, [page])

  useEffect(() => { cargar() }, [cargar])

  const borrar = async (c: AdminComunidad) => {
    if (!confirm(`¿Eliminar la comunidad "${c.nombre}"? Sus publicaciones se conservarán como publicaciones normales.`)) return
    await eliminarComunidad(c.id)
    cargar()
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
        Comunidades
      </h2>
      <div
        className="rounded-2xl overflow-x-auto"
        style={{ border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}
      >
        <table className="w-full min-w-170 text-sm" style={{ color: 'var(--color-text)' }}>
          <thead>
            <tr
              className="text-left text-[0.7rem] uppercase tracking-wide"
              style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)' }}
            >
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 font-semibold">Categoría</th>
              <th className="px-4 py-3 font-semibold">Creador</th>
              <th className="px-4 py-3 font-semibold">Miembros</th>
              <th className="px-4 py-3 font-semibold">Visibilidad</th>
              <th className="px-4 py-3 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                <td className="px-4 py-3 font-semibold">{c.nombre}</td>
                <td className="px-4 py-3" style={{ color: 'var(--color-muted)' }}>{c.categoria ?? '—'}</td>
                <td className="px-4 py-3" style={{ color: 'var(--color-muted)' }}>{c.creadorUsername ? `@${c.creadorUsername}` : '—'}</td>
                <td className="px-4 py-3 font-semibold">{c.totalMiembros}</td>
                <td className="px-4 py-3">
                  <span
                    className="text-[0.7rem] font-semibold px-2.5 py-1 rounded-full"
                    style={c.esPublica
                      ? { color: 'var(--color-brand)', background: 'color-mix(in srgb, var(--color-brand) 12%, transparent)' }
                      : { color: 'var(--color-muted)', background: 'var(--color-surface-2)' }}
                  >
                    {c.esPublica ? 'Pública' : 'Privada'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => borrar(c)}
                    className="rounded-full px-3 py-1 text-xs font-semibold transition-all"
                    style={{ color: 'var(--color-error)', border: '1.5px solid var(--color-error)' }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Paginacion page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  )
}
