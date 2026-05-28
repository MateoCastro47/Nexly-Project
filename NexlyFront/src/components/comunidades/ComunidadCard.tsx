import { useNavigate } from "react-router-dom";
import type { Comunidad } from "../../types";

export default function ComunidadCard({ comunidad, index = 0 } : {comunidad: Comunidad, index?: number}){
    const navigate = useNavigate()

    // Color de banner determinista por comunidad → la cuadrícula gana variedad visual.
    const hue = (comunidad.id * 53) % 360
    const cover = `linear-gradient(135deg, oklch(0.60 0.17 ${hue}), oklch(0.66 0.13 ${(hue + 48) % 360}))`

    return (
        <button
        onClick={() => navigate(`/comunidades/${comunidad.id}`)}
        className="row-enter rounded-2xl overflow-hidden flex flex-col text-left transition-all"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', animationDelay: `${index * 0.04}s` }}
        onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'color-mix(in oklch, var(--color-border), var(--color-accent-1) 25%)'
            ;(e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'
            ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'
            ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
            ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
        }}>
            {/* Banner */}
            <div className="h-14 w-full" style={{ background: cover }} />

            {/* Cuerpo */}
            <div className="px-4 pb-4 flex flex-col gap-2">
                <div className="flex items-end justify-between -mt-7">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0" style={{ border: '3px solid var(--color-surface)', background: 'var(--color-surface)' }}>
                        {comunidad.foto ? (
                            <img src={comunidad.foto} className="w-full h-full object-cover" alt="" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold" style={{ background: cover }}>
                                {comunidad.nombre[0].toUpperCase()}
                            </div>
                        )}
                    </div>
                    {comunidad.esMiembro && (
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full mb-1 shrink-0" style={{ background: 'var(--color-accent-1-tint)', color: 'var(--color-accent-1)' }}>
                            MIEMBRO
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>{comunidad.nombre}</p>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{
                            background: comunidad.esPublica ? 'var(--color-accent-1-tint)' : 'var(--color-surface-3)',
                            color: comunidad.esPublica ? 'var(--color-accent-1)' : 'var(--color-muted)',
                        }}>
                            {comunidad.esPublica ? 'PÚBLICA' : 'PRIVADA'}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs min-w-0" style={{ color: 'var(--color-muted)' }}>
                        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <span className="shrink-0"><span className="font-semibold" style={{ color: 'var(--color-text-2)' }}>{comunidad.totalMiembros}</span> miembros</span>
                        {comunidad.categoria && (
                            <>
                                <span className="shrink-0">·</span>
                                <span className="truncate">{comunidad.categoria}</span>
                            </>
                        )}
                    </div>

                    {comunidad.descripcion && (
                        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--color-muted)' }}>{comunidad.descripcion}</p>
                    )}
                </div>
            </div>
        </button>
    )
}
