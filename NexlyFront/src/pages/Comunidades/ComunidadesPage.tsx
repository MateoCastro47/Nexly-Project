import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useComunidadesStore } from "../../store/comunidadesStore";
import ComunidadCard from "../../components/comunidades/ComunidadCard";
import CrearComunidadModal from "../../components/comunidades/CrearComunidadModal";

export default function ComunidadesPage(){
    const [searchParams, setSearchParams] = useSearchParams()
    const qInicial = searchParams.get('q') ?? ''
    const [q, setQ] = useState(qInicial)
    const [creando, setCreando] = useState(false)
    const sentinelRef = useRef<HTMLDivElement>(null)

    const { lista, hayMas, loadingLista, cargarLista, cargarMasLista } = useComunidadesStore()

    useEffect(() => { cargarLista(qInicial) }, [cargarLista, qInicial])

    useEffect(() => {
        const el = sentinelRef.current
        if (!el) return
        const obs = new IntersectionObserver(([el]) => { if (el.isIntersecting) cargarMasLista() }, {threshold: 0.1})
        obs.observe(el)
        return () => obs.disconnect()
    }, [cargarMasLista, lista.length])

    const onBuscar = () => {
        const valor = q.trim()
        setSearchParams(valor ? { q: valor } : {})
        cargarLista(valor)
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="page-header -mx-5 -mt-6 px-5 pt-5 pb-3 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                    <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Comunidades</h1>
                    <button
                        onClick={() => setCreando(true)}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full text-white transition-transform active:scale-95"
                        style={{ background: 'var(--gradient-brand)', boxShadow: 'var(--shadow-glow-1)' }}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Crear
                    </button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onBuscar() }} className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none" style={{ color: 'var(--color-muted)' }}>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </span>
                    <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar comunidades..."
                        className="input w-full rounded-xl pl-10 pr-4 py-2.5 text-sm" />
                </form>
            </div>

            {loadingLista && lista.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[...Array(6)].map((_, i) =>(
                        <div key={i} className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                            <div className="skeleton h-14 w-full rounded-none" />
                            <div className="px-4 pb-4">
                                <div className="skeleton w-14 h-14 rounded-2xl -mt-7 mb-3" style={{ border: '3px solid var(--color-surface)' }} />
                                <div className="skeleton h-3 rounded-full w-1/2 mb-2" />
                                <div className="skeleton h-2 rounded-full w-2/3 mb-2" />
                                <div className="skeleton h-2 rounded-full w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : lista.length === 0 ? (
                <div className="flex flex-col items-center py-20 gap-3 text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--color-accent-1-tint)' }}>
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--color-accent-1)' }}>
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                    <p className="font-semibold" style={{color: 'var(--color-text)'}}>{qInicial ? `Sin resultados para "${qInicial}"` : "Aún no hay comunidades"}</p>
                    <p className="text-sm max-w-xs" style={{ color: 'var(--color-muted)' }}>{qInicial ? 'Prueba con otro término' : '¡Se el primero en crear una!'}</p>
                </div>
            ) : (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {lista.map((c, i) => <ComunidadCard key={c.id} comunidad={c} index={i} />)}
                </div>
                {hayMas && <div ref={sentinelRef} className="h-4" />}
                {loadingLista && lista.length > 0 && <p className="text-center text-sm" style={{ color: 'var(--color-muted)' }}>Cargando…</p>}
                </>
            )}

            {creando && <CrearComunidadModal onClose={() => setCreando(false)} />}
        </div>
    )
}