interface Props {
  page: number
  totalPages: number
  onChange: (p: number) => void
}

/** Controles de paginación compartidos por las tablas del panel de administración. */
export default function Paginacion({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-3 mt-5 text-sm" style={{ color: 'var(--color-muted)' }}>
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        className="rounded-full px-4 py-1.5 font-semibold transition-all disabled:opacity-40"
        style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text)' }}
      >
        Anterior
      </button>
      <span>Página {page + 1} de {totalPages}</span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page + 1 >= totalPages}
        className="rounded-full px-4 py-1.5 font-semibold transition-all disabled:opacity-40"
        style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text)' }}
      >
        Siguiente
      </button>
    </div>
  )
}
