import { useCallback, useEffect, useState } from 'react'
import { getPublicaciones, eliminarPublicacion, type AdminPublicacion } from '../../api/admin'
import Paginacion from './Paginacion'

export default function AdminPublicaciones() {
  const [items, setItems] = useState<AdminPublicacion[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const cargar = useCallback(() => {
    getPublicaciones(page, 20).then((r) => {
      setItems(r.data.content)
      setTotalPages(r.data.totalPages)
    })
  }, [page])

  useEffect(() => { cargar() }, [cargar])

  const borrar = async (p: AdminPublicacion) => {
    if (!confirm('¿Eliminar esta publicación? Se borrarán también sus comentarios y reacciones.')) return
    await eliminarPublicacion(p.id)
    cargar()
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
        Publicaciones
      </h2>
      <div className="flex flex-col gap-3">
        {items.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl p-4 flex items-start justify-between gap-4 transition-all hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(165deg, var(--color-surface), var(--color-surface-2))',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5 text-xs" style={{ color: 'var(--color-muted)' }}>
                <span className="font-semibold" style={{ color: 'var(--color-text)' }}>@{p.autorUsername}</span>
                {p.tipoPost && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[0.65rem] font-semibold"
                    style={{ color: 'var(--color-brand)', background: 'color-mix(in srgb, var(--color-brand) 12%, transparent)' }}
                  >
                    {p.tipoPost}
                  </span>
                )}
                {p.comunidadNombre && <span>· en <b style={{ color: 'var(--color-text)' }}>{p.comunidadNombre}</b></span>}
                <span>· {new Date(p.fechaCreacion).toLocaleDateString()}</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--color-text)' }}>{p.contenido}</p>
            </div>
            <button
              onClick={() => borrar(p)}
              className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-all"
              style={{ color: 'var(--color-error)', border: '1.5px solid var(--color-error)' }}
            >
              Eliminar
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm" style={{ color: 'var(--color-muted)' }}>No hay publicaciones.</p>}
      </div>
      <Paginacion page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  )
}
