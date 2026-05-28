import { Link } from "react-router-dom";
import { useChatStore } from "../../store/chatStore";
import type { Mensaje } from "../../types";

interface Props {
    mensaje: Mensaje
    esMio: boolean
}

export default function MensajeBurbuja({ mensaje, esMio }: Props) {
    const reintentarEnvio = useChatStore((s) => s.reintentarEnvio)

    const hora = new Date(mensaje.fechaEnvia).toLocaleTimeString('es', {
        hour: '2-digit',
        minute: '2-digit',
    })

    return (
        <div className={`flex gap-2 ${esMio ? 'flex-row-reverse' : 'flex-row'}`}>
            {!esMio && (
                <Link
                    to={`/perfil/${mensaje.autorUsername}`}
                    className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold overflow-hidden"
                    style={{ background: 'var(--gradient-brand)' }}
                >
                    {mensaje.autorFoto ? (
                        <img src={mensaje.autorFoto} alt={mensaje.autorUsername} className="w-full h-full object-cover" />
                    ) : (
                        mensaje.autorUsername[0]?.toUpperCase()
                    )}
                </Link>
            )}
            <div className={`flex flex-col max-w-[70%] ${esMio ? 'items-end' : 'items-start'}`}>
                {!esMio && (
                    <Link
                        to={`/perfil/${mensaje.autorUsername}`}
                        className="text-xs mb-1 hover:underline"
                        style={{ color: 'var(--color-muted)' }}
                    >
                        {mensaje.autorUsername}
                    </Link>
                )}
                <div
                    className="px-3.5 py-2 rounded-2xl text-sm wrap-break-word"
                    style={esMio
                        ? { background: 'var(--gradient-brand)', color: '#fff', borderTopRightRadius: 4, opacity: mensaje.pendiente ? 0.6 : 1, boxShadow: 'var(--shadow-sm)' }
                        : { background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderTopLeftRadius: 4, boxShadow: 'var(--shadow-xs)' }}
                >
                    {mensaje.contenido}
                </div>
                <span className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                    {mensaje.error ? (
                        <button
                            onClick={() => reintentarEnvio(mensaje)}
                            className="hover:underline"
                            style={{ color: 'var(--color-accent-2)' }}
                        >
                            No se envió · Reintentar
                        </button>
                    ) : mensaje.pendiente ? 'Enviando…' : hora}
                </span>
            </div>
        </div>
    )
}
