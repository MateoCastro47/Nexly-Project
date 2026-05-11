import { useNavigate } from "react-router-dom"
import type { Comunidad, Usuario } from "../../types"

interface Props {
    query: string
    usuarios: Usuario[]
    comunidades: Comunidad[]
    loading: boolean
    sinResultados: boolean
    onClose: () => void
}

export default function BusquedaDropdown({query, usuarios, comunidades, loading, sinResultados, onClose}: Props) {
    const navigate = useNavigate()

    function irAPerfil(nombreUsuario: string) {
        navigate(`/perfil/${nombreUsuario}`)
        onClose()
    }

    function irAComunidad(id: number) {
        navigate(`/comunidades/${id}`)
        onClose()
    }

    function verTodos() {
        navigate(`/busqueda?q=${encodeURIComponent(query)}`)
        onClose()
    }

    return (
        <div
            className="absolute top-full left-0 right-0 mt-1.5 rounded-2xl overflow-hidden z-50"
            style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-lg)'
            }}
        >
        {loading && (
            // 3 filas skeleton
            <div className="p-3 flex flex-col gap-2">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2.5 animate-pulse">
                    <div className="w-8 h-8 rounded-full shrink-0" style={{ background: 'var(--color-border)' }} />
                    <div className="flex-1 h-3 rounded-full" style={{ background: 'var(--color-border)' }} />
                </div>
            ))}
            </div>
        )}

        {sinResultados && (
            <p className="px-4 py-5 text-sm text-center" style={{ color: 'var(--color-muted)' }}>
                Sin resultado para "<strong>{query}</strong>"
            </p>
        )}

        {!loading && usuarios.length > 0 && (
            <div>
                <p className="px-4 pt-3 pb-1 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-muted)'}}>
                    Personas
                </p>
                {usuarios.slice(0, 5).map((u) => (
                    <button
                        key={u.id}
                        onClick={() => irAPerfil(u.nombreUsuario)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                        {u.fotoPerfil ? (
                            <img src={u.fotoPerfil} alt="fotoPerfil" className="w-8 h-8 rounded-full object-cover shrink-0" />
                        ) : (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ background: 'var(--color-accent-1-dark)' }}>
                                {u.nombreCompleto[0].toUpperCase()}
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="text-sm font-semibold truncate" style={{color: 'var(--color-text)' }}>{u.nombreCompleto}</p>
                            <p className="text-xs truncate" style={{color: 'var(--color-muted)' }}>@{u.nombreUsuario}</p>
                        </div>
                    </button>
                ))}
            </div>
        )}

        {!loading && comunidades.length > 0 && (
            <div>
            <p className="px-4 pt-3 pb-1 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
                Comunidades
            </p>
            {comunidades.slice(0, 3).map((c) => (
                <button
                key={c.id}
                onClick={() => irAComunidad(c.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                {c.imagenUrl ? (
                    <img src={c.imagenUrl} className="w-8 h-8 rounded-xl object-cover shrink-0" alt="" />
                ) : (
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: 'var(--gradient-brand)' }}>
                    {c.nombre[0].toUpperCase()}
                    </div>
                )}
                <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>{c.nombre}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--color-muted)' }}>{c.totalMiembros} miembros</p>
                </div>
                </button>
            ))}
            </div>
        )}

        {/* Ver todos */}
        {(usuarios.length > 0 || comunidades.length > 0) && (
            <button
            onClick={verTodos}
            className="w-full px-4 py-3 text-sm font-semibold text-center transition-colors border-t"
            style={{ color: 'var(--color-accent-1)', borderColor: 'var(--color-border)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-accent-1-tint)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
            Ver todos los resultados para "{query}"
            </button>
        )}
        </div>
    )
}