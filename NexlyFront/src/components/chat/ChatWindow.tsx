import { Fragment, useEffect, useRef } from "react";
import { useChatStore } from "../../store/chatStore";
import { useAuthStore } from "../../store/authStore";
import MensajeBurbuja from "./MensajeBurbuja";
import InputMensaje from "./InputMensaje";
import { esMismoDia, etiquetaDia } from "../../utils/fecha";

export default function ChatWindow() {
    const activaId = useChatStore((s) => s.activaId)
    const conversaciones = useChatStore((s) => s.conversaciones)
    const porConversacion = useChatStore((s) => s.porConversacion)
    const cargarMas = useChatStore((s) => s.cargarMas)
    const usuario = useAuthStore((s) => s.usuario)
    const bottomRef = useRef<HTMLDivElement>(null)

    const conversacion = conversaciones.find((c) => c.id === activaId)
    const estado = activaId != null ? porConversacion[activaId] : null

    // Scroll al último mensaje cuando llegan nuevos mensajes
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [estado?.items.length])

    if (activaId == null) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-3" style={{ color: 'var(--color-muted)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--color-surface-2)' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                </div>
                <p className="text-sm">Selecciona una conversación para comenzar</p>
            </div>
        )
    }

    const otro = !conversacion?.esGrupal ? conversacion?.participantes.find((p) => p.id !== usuario?.id) : null
    const nombre = conversacion?.esGrupal ? conversacion.nombre : otro?.username
    const foto = otro?.fotoPerfil ?? conversacion?.foto

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-5 py-3 flex items-center gap-3 shrink-0" style={{ borderBottom: '1px solid var(--color-border)' }}>
                {foto ? (
                    <img src={foto} alt={nombre ?? ''} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'var(--gradient-brand)' }}>
                        {(nombre ?? '?')[0].toUpperCase()}
                    </div>
                )}
                <span className="font-semibold">{nombre ?? 'Conversación'}</span>
            </div>

            <div
                className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3"
                onScroll={(e) => {
                    if (e.currentTarget.scrollTop < 80 && estado?.hayMas) {
                        cargarMas(activaId)
                    }
                }}
            >
                {estado?.loading && (
                    <p className="text-center text-xs py-2" style={{ color: 'var(--color-muted)' }}>Cargando mensajes...</p>
                )}
                {estado?.items.map((msg, i) => {
                    const anterior = estado.items[i - 1]
                    const nuevoDia = !anterior || !esMismoDia(anterior.fechaEnvia, msg.fechaEnvia)
                    return(
                        <Fragment key={msg.id}>
                            {nuevoDia && (
                                <div className="self-center text-[11px] px-3 py-1 rounded-full my-2" style={{background: 'var(--color-surface-2)', color: 'var(--color-muted)' }}>
                                    {etiquetaDia(msg.fechaEnvia)}
                                </div>
                            )}
                            <MensajeBurbuja mensaje={msg} esMio={msg.autorId === usuario?.id}/>
                        </Fragment>
                    )
                })}
                <div ref={bottomRef} />
            </div>

            <InputMensaje conversacionId={activaId} />
        </div>
    )
}
