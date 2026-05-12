import { useState } from "react";
import { useChatStore } from "../../store/chatStore";
import ConversacionItem from "./ConversacionItem";
import NuevoMensajeModal from "./NuevoMensajeModal";

export default function ConversacionList() {
    const conversaciones = useChatStore((s) => s.conversaciones)
    const activaId = useChatStore((s) => s.activaId)
    const seleccionar = useChatStore((s) => s.seleccionar)
    const loading = useChatStore((s) => s.loadingConversaciones)
    const [modal, setModal] = useState(false)

    return (
        <div className="w-80 shrink-0 flex flex-col" style={{ borderRight: '1px solid var(--color-border)' }}>
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <h2 className="font-bold text-lg">Mensajes</h2>
                <button
                    onClick={() => setModal(true)}
                    title="Nuevo mensaje"
                    className="p-2 rounded-full transition-colors hover:bg-(--color-accent-1-tint)"
                    style={{ color: 'var(--color-accent-1)' }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                {loading && (
                    <p className="text-center text-sm py-6" style={{ color: 'var(--color-muted)' }}>Cargando...</p>
                )}
                {!loading && conversaciones.length === 0 && (
                    <div className="flex flex-col items-center gap-2 py-12 px-6 text-center" style={{ color: 'var(--color-muted)' }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.4 }}>
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <p className="text-sm">No tienes conversaciones aún</p>
                        <button onClick={() => setModal(true)} className="text-sm hover:underline" style={{ color: 'var(--color-accent-1)' }}>
                            Iniciar una conversación
                        </button>
                    </div>
                )}
                {conversaciones.map((conv) => (
                    <ConversacionItem
                        key={conv.id}
                        conversacion={conv}
                        activa={conv.id === activaId}
                        onClick={() => seleccionar(conv.id)}
                    />
                ))}
            </div>
            {modal && <NuevoMensajeModal onClose={() => setModal(false)} />}
        </div>
    )
}
