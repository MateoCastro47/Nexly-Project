import type { Mensaje } from "../../types";

interface Props {
    mensaje: Mensaje
    esMio: boolean
}

export default function MensajeBurbuja({ mensaje, esMio }: Props) {
    const hora = new Date(mensaje.fechaEnvia).toLocaleTimeString('es', {
        hour: '2-digit',
        minute: '2-digit',
    })

    return (
        <div className={`flex gap-2 ${esMio ? 'flex-row-reverse' : 'flex-row'}`}>
            {!esMio && (
                <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold overflow-hidden" style={{ background: 'var(--gradient-brand)' }}>
                    {mensaje.autorFoto ? (
                        <img src={mensaje.autorFoto} alt={mensaje.autorUsername} className="w-full h-full object-cover" />
                    ) : (
                        mensaje.autorUsername[0].toUpperCase()
                    )}
                </div>
            )}
            <div className={`flex flex-col max-w-[70%] ${esMio ? 'items-end' : 'items-start'}`}>
                {!esMio && (
                    <span className="text-xs mb-1" style={{ color: 'var(--color-muted)' }}>{mensaje.autorUsername}</span>
                )}
                <div
                    className="px-3 py-2 rounded-2xl text-sm wrap-break-word"
                    style={esMio
                        ? { background: 'var(--color-accent-1)', color: '#fff', borderTopRightRadius: 4 }
                        : { background: 'var(--color-surface-2)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderTopLeftRadius: 4 }}
                >
                    {mensaje.contenido}
                </div>
                <span className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>{hora}</span>
            </div>
        </div>
    )
}
