import { useAuthStore } from "../../store/authStore";
import type { Conversacion } from "../../types";

interface Props {
    conversacion: Conversacion
    activa: boolean
    onClick: () => void
}

export default function ConversacionItem({ conversacion, activa, onClick }: Props) {
    const usuario = useAuthStore((s) => s.usuario)

    const otro = !conversacion.esGrupal
        ? conversacion.participantes.find((p) => p.id !== usuario?.id)
        : null;

    const nombre = conversacion.esGrupal ? conversacion.nombre : otro?.username ?? 'Usuario'
    const foto = conversacion.esGrupal ? conversacion.foto : otro?.fotoPerfil

    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-(--color-surface-2)"
            style={activa ? { background: 'var(--color-accent-1-tint)' } : undefined}
        >
            <div className="relative shrink-0">
                {foto ? (
                    <img src={foto} alt={nombre ?? ''} className="w-11 h-11 rounded-full object-cover" />
                ) : (
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: 'var(--gradient-brand)' }}>
                        {(nombre ?? '?')[0].toUpperCase()}
                    </div>
                )}
                {conversacion.noLeidos > 0 && (
                    <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center leading-none" style={{ background: 'var(--color-accent-1)' }}>
                        {conversacion.noLeidos > 9 ? '9+' : conversacion.noLeidos}
                    </span>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{nombre}</p>
                {conversacion.ultimoMensajePreview && (
                    <p className="text-xs truncate" style={{ color: 'var(--color-muted)' }}>{conversacion.ultimoMensajePreview}</p>
                )}
            </div>
        </button>
    )
}
