import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import type { Usuario } from "../../types";
import { Link } from "react-router-dom";

interface Props {
    autor: Usuario;
    fechaCreacion: string
    comunidadNombre?: string
    onEliminar?: () => void
    isHero?: boolean
}

function tiempoRelativo(fecha: string){
    const diff = Date.now() - new Date(fecha).getTime()
    const min = Math.floor(diff / 60_000)
    const h = Math.floor(diff / 3_600_000)
    const d = Math.floor(diff / 86_400_000)
    if(min < 1) return 'ahora'
    if(min < 60) return `${min}m`
    if(h < 24) return `${h}h`
    if(d < 7) return `${d}d`
    return new Date(fecha).toLocaleDateString('es-ES', {day: 'numeric', month: 'short'})
}

export default function PostHeader({autor, fechaCreacion, comunidadNombre, onEliminar, isHero}: Props){
    const usuarioActual = useAuthStore((s) => s.usuario)
    const [menuAbierto, setMenuAbierto] = useState(false)
    const [fotoError, setFotoError] = useState(false)
    const esPropio = usuarioActual?.id === autor.id

    const avatarSize = isHero ? 'w-12 h-12' : 'w-10 h-10'

    return (
        <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
                <Link
                  to={`/perfil/${autor.nombreUsuario}`}
                  className={`shrink-0 avatar-ring ${isHero ? 'avatar-hero' : ''}`}
                >
                    {autor.fotoPerfil && !fotoError ? (
                        <img src={autor.fotoPerfil}
                        alt=""
                        className={`${avatarSize} rounded-full object-cover`}
                        onError={() => setFotoError(true)}
                        />
                    ) : (
                        <div
                            className={`${avatarSize} rounded-full flex items-center justify-center text-white font-bold ${isHero ? 'text-base' : 'text-sm'}`}
                            style={{ background: 'var(--color-accent-1-dark)' }}
                        >
                            {autor.nombreCompleto[0].toUpperCase()}
                        </div>
                    )}
                </Link>
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Link
                        to={`/perfil/${autor.nombreUsuario}`}
                        className={`font-semibold leading-tight hover:underline truncate name-display ${
                          isHero ? 'name-hero text-base' : 'text-sm'
                        }`}
                        style={isHero ? undefined : { color: 'var(--color-text)' }}
                        >
                        {autor.nombreCompleto}
                        </Link>
                        {comunidadNombre && (
                        <>
                            <span style={{ color: 'var(--color-muted)' }} className="text-xs">en</span>
                            <span
                              className="text-xs font-semibold px-2 py-0.5 rounded-full"
                              style={{
                                color: 'var(--color-accent-1)',
                                background: 'var(--color-accent-1-tint)',
                              }}
                            >
                            {comunidadNombre}
                            </span>
                        </>
                        )}
                    </div>
                    <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--color-muted)' }}>
                        @{autor.nombreUsuario}
                        <span
                          className="inline-block w-1 h-1 rounded-full"
                          style={{ background: 'var(--color-muted)' }}
                        />
                        {tiempoRelativo(fechaCreacion)}
                    </p>
                </div>
            </div>
            
        {/* Menú opciones — solo en publicaciones propias */}
        {esPropio && onEliminar && (
            <div className="relative shrink-0">
            <button
                onClick={() => setMenuAbierto((v) => !v)}
                className="p-2 rounded-xl transition-all"
                style={{ color: 'var(--color-muted)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--color-accent-1-tint)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--color-accent-1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--color-muted)';
                }}
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5"  r="1" fill="currentColor" />
                <circle cx="12" cy="12" r="1" fill="currentColor" />
                <circle cx="12" cy="19" r="1" fill="currentColor" />
                </svg>
            </button>

            {menuAbierto && (
                <>
                {/* Overlay para cerrar al hacer clic fuera */}
                <div className="fixed inset-0 z-10" onClick={() => setMenuAbierto(false)} />
                <div
                    className="absolute right-0 top-10 z-20 rounded-2xl py-1.5 min-w-[160px]"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      boxShadow: 'var(--shadow-lg)',
                      animation: 'scaleIn 0.15s ease-out',
                    }}
                >
                    <button
                    onClick={() => { onEliminar(); setMenuAbierto(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2.5 transition-colors rounded-xl mx-auto"
                    style={{ color: 'var(--color-error)', width: 'calc(100% - 8px)', marginLeft: '4px' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'oklch(0.62 0.24 28 / 0.08)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                    >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Eliminar publicación
                    </button>
                </div>
                </>
            )}
            </div>
        )}
        </div>
    )
}