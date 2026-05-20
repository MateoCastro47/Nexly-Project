import { useNavigate } from "react-router-dom";
import type { Comunidad } from "../../types";

export default function ComunidadCard({ comunidad } : {comunidad: Comunidad}){
    const navigate = useNavigate()
    return (
        <button 
        onClick={() => navigate(`/comunidades/${comunidad.id}`)}
        className="rounded-2xl p-4 flex flex-col gap-3 text-left transition-all"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'color-mix(in oklch, var(--color-border), var(--color-accent-1) 25%)'
            ;(e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'
        }}
        onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'
            ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
        }}>
            <div className="flex items-center gap-3">
            {comunidad.foto ? (
                <img src={comunidad.foto} className="w-12 h-12 rounded-xl object-cover shrink-0" alt="" />
            ) : (
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0" style={{ background: 'var(--gradient-brand)' }}>
                    {comunidad.nombre[0].toUpperCase()}
                </div>
            )}
            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate" style={{color: 'var(--color-text)' }}>{comunidad.nombre}</p>
                <p className="text-xs truncate" style={{ color: 'var(--color-muted)' }}>
                    {comunidad.totalMiembros} miembros · {comunidad.esPublica ? 'Pública' : 'Privada'}
                </p>
            </div>
            {comunidad.esMiembro && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full shrink-0" style={{ background: 'var(--color-accent-1-tint)', color: 'var(--color-accent-1)' }}>
                MIEMBRO
            </span>
            )}
        </div>
        {comunidad.descripcion && (
            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--color-muted)' }}>{comunidad.descripcion}</p>
        )}
        </button>
    )
}