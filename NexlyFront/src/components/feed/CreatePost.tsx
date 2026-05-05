import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useFeedStore } from "../../store/feedStore";

type Visibilidad = 'PUBLICA' | 'SEGUIDORES' | 'PRIVADA'

const VISIBILIDAD_OPTS: {value: Visibilidad; label: string}[] = [
    { value: 'PUBLICA',    label: 'Público'    },
    { value: 'SEGUIDORES', label: 'Seguidores' },
    { value: 'PRIVADA',    label: 'Solo yo'    },
]

const MAX_CHARS = 280

export default function CreatePost(){
    const usuario = useAuthStore((s) => s.usuario)
    const crear = useFeedStore((s) => s.crear)
    const [contenido, setContenido] = useState('')
    const [visibilidad, setVisibilidad] = useState<Visibilidad>('PUBLICA')
    const[loading, setLoading] = useState(false)
    const [focused, setFocused] = useState(false)

    if(!usuario) return null

    const expanded = focused || contenido.length > 0
    const canSubmit = contenido.trim().length > 0 && contenido.length <= MAX_CHARS && !loading

    const handleSubmit = async () => {
        if(!canSubmit) return
        setLoading(true)
        try{
            await crear({contenido: contenido.trim(), visibilidad, imagenes: []})
            setContenido('')
            setFocused(false)
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="rounded-2xl p-4 flex flex-col gap-3 shadow-sm" style={{background:'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <div className="flex gap-3">
                {usuario.fotoPerfil ? (
                    <img src={usuario.fotoPerfil} alt="Foto Perfil" className="w-10 h-10 rounded-full object-cover shrink-0"/>
                ):(
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{background: 'var(--color-brand)' }}
                    >
                        {usuario.nombreCompleto[0].toUpperCase()}
                    </div>
                )}

                <textarea 
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    onFocus={() => setFocused(true)}
                    placeholder="¿Qué está pasando?"
                    rows={expanded ? 3 : 1}
                    className="flex-1 resize-none bg-transparent text-sm outline-none loading-relaxed"
                    style={{
                        color: 'var(--color-text)',
                        caretColor: 'var(--color-brand)',
                    }}
                    onKeyDown={(e) =>{
                        if(e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit()
                    }}
                    />
            </div>
            {expanded && (
                <div
                className="flex items-center justify-between pt-2 border-t"
                style={{ borderColor: 'var(--color-border)' }}
                >
                <select
                    value={visibilidad}
                    onChange={(e) => setVisibilidad(e.target.value as Visibilidad)}
                    className="text-xs px-2 py-1 rounded-lg border bg-transparent outline-none"
                    style={{ color: 'var(--color-brand)', borderColor: 'var(--color-border)' }}
                >
                    {VISIBILIDAD_OPTS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                    ))}
                </select>

                <div className="flex items-center gap-3">
                    <span
                    className="text-xs tabular-nums"
                    style={{ color: contenido.length > MAX_CHARS ? 'var(--color-error)' : 'var(--color-muted)' }}
                    >
                    {contenido.length}/{MAX_CHARS}
                    </span>
                    <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className="px-4 py-1.5 rounded-full text-sm font-semibold text-white transition-opacity disabled:opacity-40"
                    style={{ background: 'var(--color-brand)' }}
                    >
                    {loading ? 'Publicando…' : 'Publicar'}
                    </button>
                </div>
                </div>
            )}
        </div>
    )
}