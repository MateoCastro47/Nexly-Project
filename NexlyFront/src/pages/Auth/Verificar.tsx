import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { verificarEmail } from '../../api/auth'

type Estado = 'verificando' | 'ok' | 'error'

export default function Verificar() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [estado, setEstado] = useState<Estado>('verificando')
  const [mensaje, setMensaje] = useState('')
  const yaEjecutado = useRef(false)

  useEffect(() => {
    if (yaEjecutado.current) return // evita la doble llamada de StrictMode en dev
    yaEjecutado.current = true

    if (!token) {
      setEstado('error')
      setMensaje('Falta el token de verificación en el enlace.')
      return
    }
    verificarEmail(token)
      .then(({ data }) => {
        setEstado('ok')
        setMensaje(data.mensaje)
      })
      .catch((err: any) => {
        setEstado('error')
        setMensaje(err.response?.data?.error ?? 'No se pudo verificar la cuenta.')
      })
  }, [token])

  return (
    <div className="h-screen flex overflow-hidden">
      {/* ── Panel izquierdo (branding) ── */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col items-center justify-center p-14 relative overflow-hidden shrink-0"
        style={{ background: 'var(--gradient-brand)' }}
      >
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-[0.15]" style={{ background: 'white' }} />
        <div className="absolute -bottom-36 -right-20 w-105 h-105 rounded-full opacity-[0.08]" style={{ background: 'white' }} />
        <div className="relative z-10 text-center text-white select-none">
          <p className="text-6xl font-bold tracking-tight mb-6">Nexly</p>
          <p className="text-xl font-medium opacity-90">Verificación de cuenta</p>
        </div>
      </div>

      {/* ── Panel derecho ── */}
      <div
        className="flex-1 flex items-center justify-center p-6 overflow-y-auto"
        style={{ background: 'var(--color-bg)' }}
      >
        <div
          className="w-full max-w-sm rounded-2xl p-8 shadow-md text-center"
          style={{ background: 'var(--color-surface)' }}
        >
          <p className="lg:hidden text-3xl font-bold mb-6" style={{ color: 'var(--color-brand)' }}>Nexly</p>

          {estado === 'verificando' && (
            <>
              <div
                className="mx-auto mb-5 w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--color-brand)', borderTopColor: 'transparent' }}
              />
              <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                Verificando tu cuenta…
              </h2>
            </>
          )}

          {estado === 'ok' && (
            <>
              <div
                className="mx-auto mb-5 w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-brand)' }}
              >
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                ¡Cuenta verificada!
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--color-muted)' }}>{mensaje}</p>
              <Link to="/login" className="btn-primary inline-block w-full rounded-xl py-3 text-sm">
                Iniciar sesión
              </Link>
            </>
          )}

          {estado === 'error' && (
            <>
              <div
                className="mx-auto mb-5 w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-error)' }}
              >
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                No se pudo verificar
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--color-muted)' }}>{mensaje}</p>
              <Link to="/login" className="btn-outline inline-block w-full rounded-xl py-3 text-sm">
                Volver a iniciar sesión
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
