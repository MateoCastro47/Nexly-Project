import { useEffect, useRef, useState } from 'react'

const TENOR_KEY = import.meta.env.VITE_TENOR_KEY as string | undefined

interface TenorGif {
  id: string
  title: string
  media_formats: {
    tinygif: { url: string }
    gif: { url: string }
  }
}

interface Props {
  onSelect: (url: string) => void
  onClose: () => void
}

export default function GifPicker({ onSelect, onClose }: Props) {
  const [query, setQuery]   = useState('')
  const [gifs, setGifs]     = useState<TenorGif[]>([])
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = async (q: string) => {
    if (!TENOR_KEY) return
    setLoading(true)
    try {
      const endpoint = q.trim()
        ? `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(q)}&key=${TENOR_KEY}&limit=12&media_filter=tinygif,gif`
        : `https://tenor.googleapis.com/v2/featured?key=${TENOR_KEY}&limit=12&media_filter=tinygif,gif`
      const res  = await fetch(endpoint)
      const data = await res.json()
      setGifs(data.results ?? [])
    } finally {
      setLoading(false)
    }
  }

  // GIFs destacados al abrir
  useEffect(() => { search('') }, [])

  const handleSearch = (value: string) => {
    setQuery(value)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => search(value), 400)
  }

  if (!TENOR_KEY) {
    return (
      <div
        className="absolute bottom-full left-0 mb-2 w-80 rounded-2xl p-5 z-50 flex flex-col gap-3"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          Configura tu API key de Tenor
        </p>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          Agrega <code className="px-1 py-0.5 rounded font-mono"
            style={{ background: 'var(--color-bg)', color: 'var(--color-brand)' }}>
            VITE_TENOR_KEY=tu_key
          </code> a tu archivo <code className="px-1 py-0.5 rounded font-mono"
            style={{ background: 'var(--color-bg)', color: 'var(--color-brand)' }}>
            .env
          </code> y reinicia el servidor.
        </p>
        <a
          href="https://developers.google.com/tenor/guides/quickstart"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold"
          style={{ color: 'var(--color-brand)' }}
        >
          Obtener clave gratuita →
        </a>
      </div>
    )
  }

  return (
    <div
      className="absolute bottom-full left-0 mb-2 w-80 rounded-2xl overflow-hidden z-50"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* Buscador */}
      <div className="p-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <input
          autoFocus
          type="text"
          placeholder="Buscar GIFs…"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="input w-full px-3 py-1.5 text-sm rounded-lg"
        />
      </div>

      {/* Grid */}
      <div className="p-2 h-56 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div
              className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--color-brand)', borderTopColor: 'transparent' }}
            />
          </div>
        ) : gifs.length > 0 ? (
          <div className="columns-3 gap-1 space-y-1">
            {gifs.map((gif) => (
              <button
                key={gif.id}
                onClick={() => { onSelect(gif.media_formats.gif.url); onClose() }}
                className="block w-full overflow-hidden rounded-lg transition-opacity hover:opacity-80"
              >
                <img
                  src={gif.media_formats.tinygif.url}
                  alt={gif.title}
                  className="w-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-xs py-8" style={{ color: 'var(--color-muted)' }}>
            Sin resultados
          </p>
        )}
      </div>

      {/* Branding Tenor */}
      <div
        className="px-3 py-1.5 text-right border-t"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <span className="text-[10px] font-semibold tracking-wide" style={{ color: 'var(--color-muted)' }}>
          via Tenor
        </span>
      </div>
    </div>
  )
}
