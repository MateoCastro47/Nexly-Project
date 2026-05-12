import { Fragment, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
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

    const scrollRef = useRef<HTMLDivElement>(null)
    // Snapshot del scroll antes de cada mutación del DOM, para distinguir
    // "se cargaron mensajes antiguos" (prepend) de "llegó un mensaje nuevo" (append).
    const prev = useRef({ height: 0, top: 0, len: 0, firstId: undefined as number | undefined })

    const conversacion = conversaciones.find((c) => c.id === activaId)
    const estado = activaId != null ? porConversacion[activaId] : null
    const items = estado?.items

    // Al cambiar de conversación se reinicia el seguimiento
    useLayoutEffect(() => {
        prev.current = { height: 0, top: 0, len: 0, firstId: undefined }
    }, [activaId])

    useLayoutEffect(() => {
        const el = scrollRef.current
        if (!el || !items) return
        const len = items.length
        const firstId = items[0]?.id

        if (prev.current.len === 0 && len > 0) {
            el.scrollTop = el.scrollHeight // carga inicial → al fondo, sin animación
        } else if (len > prev.current.len) {
            if (firstId !== prev.current.firstId) {
                // prepend (cargarMas): conserva la posición visual
                el.scrollTop = el.scrollHeight - prev.current.height + prev.current.top
            } else {
                // append: baja solo si el usuario ya estaba cerca del fondo
                const estabaAbajo = prev.current.height - prev.current.top - el.clientHeight < 120
                if (estabaAbajo) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
            }
        }
        prev.current = { height: el.scrollHeight, top: el.scrollTop, len, firstId }
    }, [items?.length, activaId])

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

    const cabecera = (
        <>
            {foto ? (
                <img src={foto} alt={nombre ?? ''} className="w-9 h-9 rounded-full object-cover" />
            ) : (
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'var(--gradient-brand)' }}>
                    {(nombre ?? '?')[0].toUpperCase()}
                </div>
            )}
            <span className="font-semibold">{nombre ?? 'Conversación'}</span>
        </>
    )

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-5 py-3 flex items-center gap-3 shrink-0" style={{ borderBottom: '1px solid var(--color-border)' }}>
                {otro ? (
                    <Link to={`/perfil/${otro.username}`} className="flex items-center gap-3 hover:opacity-80">
                        {cabecera}
                    </Link>
                ) : (
                    cabecera
                )}
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3"
                onScroll={(e) => {
                    const el = e.currentTarget
                    prev.current.top = el.scrollTop
                    prev.current.height = el.scrollHeight
                    if (el.scrollTop < 80 && estado?.hayMas) {
                        cargarMas(activaId)
                    }
                }}
            >
                {estado?.loading && (
                    <p className="text-center text-xs py-2" style={{ color: 'var(--color-muted)' }}>Cargando mensajes...</p>
                )}
                {items?.map((msg, i) => {
                    const anterior = items[i - 1]
                    const nuevoDia = !anterior || !esMismoDia(anterior.fechaEnvia, msg.fechaEnvia)
                    return (
                        <Fragment key={msg.id}>
                            {nuevoDia && (
                                <div className="self-center text-[11px] px-3 py-1 rounded-full my-2" style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)' }}>
                                    {etiquetaDia(msg.fechaEnvia)}
                                </div>
                            )}
                            <MensajeBurbuja mensaje={msg} esMio={msg.autorId === usuario?.id} />
                        </Fragment>
                    )
                })}
            </div>

            <InputMensaje conversacionId={activaId} />
        </div>
    )
}
