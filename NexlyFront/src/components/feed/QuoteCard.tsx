import { useState } from 'react'
import type { PublicacionCitada } from '../../types'

function tiempoRelativo(fecha: string) {
  const diff = Date.now() - new Date(fecha).getTime()
  const min = Math.floor(diff / 60_000)
  const h = Math.floor(diff / 3_600_000)
  const d = Math.floor(diff / 86_400_000)
  if (min < 1) return 'ahora'
  if (min < 60) return `${min}m`
  if (h < 24) return `${h}h`
  if (d < 7) return `${d}d`
  return new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

export default function QuoteCard({ post }: { post: PublicacionCitada }) {
  const [fotoError, setFotoError] = useState(false)

  return (
    <div
      className="rounded-2xl p-3 space-y-2 cursor-pointer transition-colors"
      style={{
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface-alt, var(--color-surface))',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent-1)')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)')}
    >
      <div className="flex items-center gap-2">
        {post.autor.fotoPerfil && !fotoError ? (
          <img
            src={post.autor.fotoPerfil}
            alt=""
            className="w-5 h-5 rounded-full object-cover shrink-0"
            onError={() => setFotoError(true)}
          />
        ) : (
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
            style={{ background: 'var(--color-accent-1-dark)' }}
          >
            {post.autor.nombreCompleto[0].toUpperCase()}
          </div>
        )}
        <span className="text-xs font-semibold truncate" style={{ color: 'var(--color-text)' }}>
          {post.autor.nombreCompleto}
        </span>
        <span className="text-xs shrink-0" style={{ color: 'var(--color-muted)' }}>
          @{post.autor.nombreUsuario} · {tiempoRelativo(post.fechaCreacion)}
        </span>
      </div>

      {post.contenido && (
        <p
          className="text-xs leading-relaxed line-clamp-3"
          style={{ color: 'var(--color-text)' }}
        >
          {post.contenido}
        </p>
      )}

      {post.imagenes.length > 0 && (
        <img
          src={post.imagenes[0]}
          alt=""
          className="w-full max-h-40 object-cover rounded-xl"
        />
      )}
    </div>
  )
}
