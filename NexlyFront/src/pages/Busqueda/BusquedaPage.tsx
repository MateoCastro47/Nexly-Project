import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { buscarUsuarios, buscarComunidades } from '../../api/busqueda'
import type { Usuario, Comunidad } from '../../types'

type Tab = 'personas' | 'comunidades'

export default function BusquedaPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const q = searchParams.get('q') ?? ''
  const [tab, setTab] = useState<Tab>('personas')
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [comunidades, setComunidades] = useState<Comunidad[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q) return
    setLoading(true)
    Promise.all([buscarUsuarios(q), buscarComunidades(q)])
      .then(([{ data: u }, { data: c }]) => {
        setUsuarios(u)
        setComunidades(c)
      })
      .finally(() => setLoading(false))
  }, [q])

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 px-1 py-4"
        style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <h1 className="text-xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Resultados para "{q}"
        </h1>
        {/* Tabs */}
        <div className="flex gap-1">
          {(['personas', 'comunidades'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors"
              style={tab === t ? {
                background: 'var(--color-accent-1)',
                color: 'white',
              } : {
                color: 'var(--color-muted)',
              }}>
              {t}
              <span className="ml-1.5 text-xs opacity-70">
                {t === 'personas' ? usuarios.length : comunidades.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Resultados */}
      <div className="mt-4 rounded-2xl overflow-hidden"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        {loading ? (
          // 6 skeletons
          <div className="flex flex-col gap-3 p-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full shrink-0" style={{ background: 'var(--color-border)' }} />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-3 rounded-full w-1/3" style={{ background: 'var(--color-border)' }} />
                  <div className="h-2 rounded-full w-1/5" style={{ background: 'var(--color-border)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : tab === 'personas' ? (
          usuarios.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm" style={{ color: 'var(--color-muted)' }}>
              Sin personas para "{q}"
            </p>
          ) : (
            usuarios.map((u) => (
              <button key={u.id}
                onClick={() => navigate(`/perfil/${u.nombreUsuario}`)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors"
                style={{ borderBottom: '1px solid var(--color-border)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {u.fotoPerfil ? (
                  <img src={u.fotoPerfil} className="w-10 h-10 rounded-full object-cover shrink-0" alt="" />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: 'var(--color-accent-1-dark)' }}>
                    {u.nombreCompleto[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>{u.nombreCompleto}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--color-muted)' }}>@{u.nombreUsuario}</p>
                  {u.biografia && (
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-muted)' }}>{u.biografia}</p>
                  )}
                </div>
                <span className="text-xs shrink-0" style={{ color: 'var(--color-muted)' }}>
                  {u.seguidores} seguidores
                </span>
              </button>
            ))
          )
        ) : (
          comunidades.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm" style={{ color: 'var(--color-muted)' }}>
              Sin comunidades para "{q}"
            </p>
          ) : (
            comunidades.map((c) => (
              <button key={c.id}
                onClick={() => navigate(`/comunidades/${c.id}`)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors"
                style={{ borderBottom: '1px solid var(--color-border)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {c.foto ? (
                  <img src={c.foto} className="w-10 h-10 rounded-xl object-cover shrink-0" alt="" />
                ) : (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: 'var(--gradient-brand)' }}>
                    {c.nombre[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>{c.nombre}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--color-muted)' }}>
                    {c.totalMiembros} miembros · {c.esPublica ? 'Pública' : 'Privada'}
                  </p>
                  {c.descripcion && (
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-muted)' }}>{c.descripcion}</p>
                  )}
                </div>
              </button>
            ))
          )
        )}
      </div>
    </div>
  )
}
