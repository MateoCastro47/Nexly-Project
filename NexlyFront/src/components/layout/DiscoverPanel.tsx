import { useEffect, useRef, useState } from 'react'
import type { Usuario } from '../../types'
import { getSugerencias, seguirUsuario, dejarDeSeguirUsuario } from '../../api/usuario'
import { useBusqueda } from '../../hooks/useBusqueda'
import BusquedaDropdown from '../busqueda/BusquedaDropdown'

function AvatarSugerencia({ usuario }: { usuario: Usuario }) {
  const [imgError, setImgError] = useState(false)
  return usuario.fotoPerfil && !imgError ? (
    <img
      src={usuario.fotoPerfil}
      alt=""
      className="w-10 h-10 rounded-full object-cover"
      onError={() => setImgError(true)}
    />
  ) : (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
      style={{ background: 'var(--color-accent-1-dark)' }}
    >
      {usuario.nombreCompleto[0].toUpperCase()}
    </div>
  )
}

function SugerenciaSkeleton() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="w-10 h-10 rounded-full shrink-0" style={{ background: 'var(--color-border)' }} />
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="h-3 rounded-full w-24" style={{ background: 'var(--color-border)' }} />
        <div className="h-2.5 rounded-full w-16" style={{ background: 'var(--color-border)' }} />
      </div>
      <div className="h-7 w-16 rounded-full shrink-0" style={{ background: 'var(--color-border)' }} />
    </div>
  )
}

interface SugerenciaItemProps {
  usuario: Usuario
  onToggle: (id: number, siguiendo: boolean) => void
}

function SugerenciaItem({ usuario, onToggle }: SugerenciaItemProps) {
  const [siguiendo, setSiguiendo] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    try {
      if (siguiendo) {
        await dejarDeSeguirUsuario(usuario.id)
        setSiguiendo(false)
      } else {
        await seguirUsuario(usuario.id)
        setSiguiendo(true)
      }
      onToggle(usuario.id, !siguiendo)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="avatar-ring shrink-0">
        <AvatarSugerencia usuario={usuario} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>
          {usuario.nombreCompleto}
        </p>
        <p className="text-xs truncate" style={{ color: 'var(--color-muted)' }}>
          @{usuario.nombreUsuario}
        </p>
      </div>
      <button
        onClick={handleToggle}
        disabled={loading}
        className="shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all"
        style={siguiendo ? {
          color: 'var(--color-muted)',
          border: '1.5px solid var(--color-border)',
          background: 'transparent',
        } : {
          color: 'white',
          background: 'var(--gradient-brand)',
          border: '1.5px solid transparent',
        }}
      >
        {loading ? '...' : siguiendo ? 'Siguiendo' : 'Seguir'}
      </button>
    </div>
  )
}

export default function DiscoverPanel() {
  const [sugerencias, setSugerencias] = useState<Usuario[]>([])
  const [cargando, setCargando] = useState(true)
  const {query, setQuery, resultados, loading, limpiar, sinResultados} = useBusqueda()
  const searchRef = useRef<HTMLDivElement>(null)
  const mostrarDropdown = query.trim().length >= 2

  useEffect(() => {
    getSugerencias(5)
      .then(({ data }) => setSugerencias(data))
      .finally(() => setCargando(false))
  }, [])

  function handleToggle(id: number, ahoraSignue: boolean) {
    if (ahoraSignue) return
    setSugerencias((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <aside className="hidden xl:flex flex-col w-80 shrink-0 px-5 py-6 gap-6 h-screen sticky top-0 overflow-y-auto">

      {/* ── Buscar ── */}
      <div className="relative" ref={searchRef}>
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" />
        <input
          type="text"
          placeholder="Buscar en Nexly"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Escape' && limpiar()}
          className="input w-full pl-10 pr-8 py-2.5 text-sm rounded-2xl"
        />
        {query && (
          <button onClick={limpiar} className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--color-muted)' }}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        {mostrarDropdown && (
          <BusquedaDropdown
            query={query}
            usuarios={resultados.usuarios}
            comunidades={resultados.comunidades}
            loading={loading}
            sinResultados={sinResultados}
            onClose={limpiar}
          />
        )}
      </div>
      {/* ── Tendencias ── */}
      <div
        className="rounded-3xl p-5 flex flex-col gap-1"
        style={{
          background: 'linear-gradient(165deg, var(--color-surface), var(--color-surface-2))',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h3
          className="text-sm font-bold flex items-center gap-2 mb-3"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="url(#trend-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="trend-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="oklch(0.50 0.22 275)" />
                <stop offset="100%" stopColor="oklch(0.64 0.16 32)" />
              </linearGradient>
            </defs>
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          Tendencias
        </h3>
        {[
          { tag: '#TechLatam',       posts: '3.1K publicaciones', cat: 'Tecnología' },
          { tag: '#Desarrolladores', posts: '2.4K publicaciones', cat: 'Programación' },
          { tag: '#DiseñoWeb',       posts: '1.8K publicaciones', cat: 'Diseño' },
          { tag: '#NexlyApp',        posts: '956 publicaciones',  cat: 'Comunidad' },
          { tag: '#OpenSource',      posts: '742 publicaciones',  cat: 'Dev' },
        ].map(({ tag, posts, cat }) => (
          <button
            key={tag}
            className="w-full text-left px-3 py-2.5 rounded-2xl transition-all group"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'var(--color-accent-1-tint)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
          >
            <p className="text-[0.6875rem] font-medium" style={{ color: 'var(--color-muted)' }}>{cat}</p>
            <p className="text-sm font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>{tag}</p>
            <p className="text-[0.6875rem]" style={{ color: 'var(--color-muted)' }}>{posts}</p>
          </button>
        ))}
      </div>

      {/* ── Quién seguir ── */}
      <div
        className="rounded-3xl p-5 flex flex-col gap-4"
        style={{
          background: 'linear-gradient(165deg, var(--color-surface), var(--color-surface-2))',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h3
          className="text-sm font-bold flex items-center gap-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          <span className="text-base">✨</span>
          Quién seguir
        </h3>

        {cargando ? (
          <div className="flex flex-col gap-4">
            <SugerenciaSkeleton />
            <SugerenciaSkeleton />
            <SugerenciaSkeleton />
          </div>
        ) : sugerencias.length === 0 ? (
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
            Ya sigues a todos los usuarios disponibles.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {sugerencias.map((u) => (
              <SugerenciaItem key={u.id} usuario={u} onToggle={handleToggle} />
            ))}
          </div>
        )}
      </div>

      {/* ── Footer legal ── */}
      <div className="mt-auto pt-4">
        <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          <a href="#" className="hover:underline">Términos</a> · <a href="#" className="hover:underline">Privacidad</a> · <a href="#" className="hover:underline">Cookies</a>
        </p>
        <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.01 50)' }}>
          © 2026 Nexly
        </p>
      </div>
    </aside>
  )
}
