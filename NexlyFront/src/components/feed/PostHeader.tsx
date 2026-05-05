import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import type { Usuario } from "../../types";
import { Link } from "react-router-dom";

interface Props {
    autor: Usuario;
    fechaCreacion: string
    comunidadNombre?: string
    onEliminar?: () => void 
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

export default function PostHeader({autor, fechaCreacion, comunidadNombre, onEliminar}: Props){
    const usuarioActual = useAuthStore((s) => s.usuario)
    const [menuAbierto, setMenuAbierto] = useState(false)
    const esPropio = usuarioActual?.id === autor.id

    return (
        <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
                <Link to={`/perfil/${autor.nombreUsuario}`} className="shrink-0">
                    {autor.fotoPerfil ? (
                        <img src={autor.fotoPerfil} 
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                            style={{ background: 'var(--color-brand)'}}
                        >
                            {autor.nombreCompleto[0].toUpperCase()}
                        </div>
                    )}
                </Link>
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Link
                        to={`/perfil/${autor.nombreUsuario}`}
                        className="text-sm font-semibold leading-tight hover:underline truncate"
                        style={{ color: 'var(--color-text)' }}
                        >
                        {autor.nombreCompleto}
                        </Link>
                        {comunidadNombre && (
                        <>
                            <span style={{ color: 'var(--color-muted)' }} className="text-xs">en</span>
                            <span className="text-xs font-medium" style={{ color: 'var(--color-brand)' }}>
                            {comunidadNombre}
                            </span>
                        </>
                        )}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                        @{autor.nombreUsuario} · {tiempoRelativo(fechaCreacion)}
                    </p>
                </div>
            </div>
            
        {/* Menú opciones — solo en publicaciones propias */}
        {esPropio && onEliminar && (
            <div className="relative shrink-0">
            <button
                onClick={() => setMenuAbierto((v) => !v)}
                className="p-1.5 rounded-lg"
                style={{ color: 'var(--color-muted)' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--color-bg)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
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
                    className="absolute right-0 top-8 z-20 rounded-xl shadow-lg py-1 min-w-[140px]"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                >
                    <button
                    onClick={() => { onEliminar(); setMenuAbierto(false) }}
                    className="w-full text-left px-4 py-2 text-sm"
                    style={{ color: 'var(--color-error)' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--color-bg)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                    >
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