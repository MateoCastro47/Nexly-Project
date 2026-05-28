import React, { useRef, useState } from "react";
import { usePerfilStore } from "../../store/perfilStore";
import type { Usuario } from "../../types";
import { uploadImagen } from "../../api/media";
import { actualizarPerfil } from "../../api/usuario";

interface Props{
    usuario: Usuario
    onClose: () => void
}

export default function EditarPerfilModal({ usuario, onClose }: Props){
    const actualizarUsuario = usePerfilStore((s) => s.actualizarUsuario)

    //Form state (Inicializado con datos iniciales)
    const [nombre, setNombre] = useState(usuario.nombreCompleto)
    const[bio, setBio] = useState(usuario.biografia ?? '')
    const [fotoPerfil, setFotoPerfil] = useState(usuario.fotoPerfil ?? '')
    const[ fotoPortada, setFotoPortada] = useState(usuario.fotoPortada ?? '')

    //UI state
    const [subiendoFoto, setSubiendoFoto] = useState(false)
    const [subiendoPortada, setSubiendoPortada] = useState(false)
    const [guardando, setGuardando] = useState(false)
    const [error, setError] = useState('')

    const fotoInputRef = useRef<HTMLInputElement>(null)
    const portadaInputRef = useRef<HTMLInputElement>(null)

    async function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>){
        const file = e.target.files?.[0]
        if(!file) return
        setSubiendoFoto(true)
        try{
            const url = await uploadImagen(file, 'perfiles')
            setFotoPerfil(url)
        } catch{
            setError('No se pudo subir la foto de perfil')
        } finally{
            setSubiendoFoto(false);
        }
    }

    async function handlePortadaChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if(!file) return
        setSubiendoPortada(true)
        try{
            const url = await uploadImagen(file, 'portadas')
            setFotoPortada(url)
        } catch{
            setError('No se pudo subir la portada')
        } finally{
            setSubiendoPortada(false)
        }
    }

    async function handleSubmit(){
        if(!nombre.trim()) return
        setGuardando(true)
        setError('')
        try{
            const {data: usuarioActualizado } = await actualizarPerfil({
                nombreCompleto: nombre.trim(),
                biografia: bio.trim() || undefined,
                fotoPerfil: fotoPerfil || undefined,
                fotoPortada: fotoPortada || undefined,
            })
            actualizarUsuario(usuarioActualizado)
            onClose()
        } catch {
            setError('No se pudo guardar los cambios')
        } finally{
            setGuardando(false)
        }
    }

    const ocupado = subiendoFoto || subiendoPortada || guardando;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ background: 'var(--color-overlay)', zIndex: 'var(--z-modal)' }}
            onClick={(e) => { if (e.target === e.currentTarget && !ocupado) onClose() }}
        >
            <div
                className="w-full max-w-lg rounded-3xl overflow-hidden flex flex-col"
                style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-xl)',
                    maxHeight: '90vh',
                }}
            >
                {/* ── Header ── */}
                <div
                    className="flex items-center justify-between px-5 py-4 shrink-0"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                >
                    <h2
                        className="text-lg font-bold"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
                    >
                        Editar perfil
                    </h2>
                    <button
                        onClick={() => !ocupado && onClose()}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-lg"
                        style={{ color: 'var(--color-muted)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                        ✕
                    </button>
                </div>

                {/* ── Scrollable body ── */}
                <div className="overflow-y-auto flex-1">

                    {/* Portada */}
                    <div
                        className="relative h-36 cursor-pointer group"
                        onClick={() => !ocupado && portadaInputRef.current?.click()}
                    >
                        {fotoPortada ? (
                            <img src={fotoPortada} className="w-full h-full object-cover" alt="" />
                        ) : (
                            <div className="w-full h-full" style={{ background: 'var(--gradient-brand-vivid)' }} />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity">
                            {subiendoPortada ? (
                                <div className="w-7 h-7 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            ) : (
                                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                            )}
                        </div>
                        <input ref={portadaInputRef} type="file" accept="image/*" className="hidden" onChange={handlePortadaChange} />
                    </div>

                    {/* Avatar */}
                    <div className="px-5 -mt-9 mb-4">
                        <div
                            className="relative w-20 h-20 rounded-full cursor-pointer group shrink-0"
                            style={{ border: '4px solid var(--color-surface)' }}
                            onClick={() => !ocupado && fotoInputRef.current?.click()}
                        >
                            {fotoPerfil ? (
                                <img src={fotoPerfil} className="w-full h-full rounded-full object-cover" alt="" />
                            ) : (
                                <div
                                    className="w-full h-full rounded-full flex items-center justify-center text-white text-2xl font-bold"
                                    style={{ background: 'var(--color-accent-1-dark)' }}
                                >
                                    {nombre[0]?.toUpperCase() ?? '?'}
                                </div>
                            )}
                            <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity">
                                {subiendoFoto ? (
                                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                ) : (
                                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                        <circle cx="12" cy="13" r="4" />
                                    </svg>
                                )}
                            </div>
                            <input ref={fotoInputRef} type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
                        </div>
                    </div>

                    {/* Campos */}
                    <div className="px-5 pb-5 flex flex-col gap-4">

                        {/* Nombre */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold" style={{ color: 'var(--color-muted)' }}>
                                Nombre completo
                            </label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                maxLength={60}
                                className="input w-full px-4 py-2.5 text-sm rounded-xl"
                            />
                            <p className="text-xs text-right" style={{ color: 'var(--color-muted)' }}>
                                {nombre.length}/60
                            </p>
                        </div>

                        {/* Biografía */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold" style={{ color: 'var(--color-muted)' }}>
                                Biografía
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                maxLength={160}
                                rows={3}
                                placeholder="Cuéntanos algo sobre ti..."
                                className="input w-full px-4 py-2.5 text-sm rounded-xl resize-none"
                            />
                            <p className="text-xs text-right" style={{ color: 'var(--color-muted)' }}>
                                {bio.length}/160
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <p
                                className="text-sm px-4 py-2.5 rounded-xl"
                                style={{
                                    color: 'var(--color-error)',
                                    background: 'oklch(0.62 0.24 28 / 0.08)',
                                    border: '1px solid oklch(0.62 0.24 28 / 0.15)',
                                }}
                            >
                                {error}
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Footer ── */}
                <div
                    className="flex gap-3 px-5 py-4 shrink-0"
                    style={{ borderTop: '1px solid var(--color-border)' }}
                >
                    <button
                        onClick={() => !ocupado && onClose()}
                        disabled={ocupado}
                        className="flex-1 py-2.5 text-sm font-semibold rounded-full transition-all disabled:opacity-40"
                        style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text)' }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={ocupado || !nombre.trim()}
                        className="flex-1 py-2.5 text-sm font-semibold rounded-full text-white transition-all disabled:opacity-40"
                        style={{ background: 'var(--gradient-brand)' }}
                    >
                        {guardando ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    )
}