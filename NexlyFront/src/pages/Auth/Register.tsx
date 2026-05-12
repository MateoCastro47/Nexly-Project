import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { register } from '../../api/auth'

// El backend manda el mensaje en data.error. Para errores de validación
// el formato es "campo: mensaje"; para conflictos (email/usuario en uso) es texto plano.
function traducirErrorRegistro(raw?: string): string {
  if (!raw) return 'Error al registrarse'
  const campo = raw.split(':')[0].trim()
  switch (campo) {
    case 'contrasena':      return 'La contraseña debe tener al menos 8 caracteres'
    case 'nombreUsuario':   return 'El nombre de usuario no es válido (máximo 50 caracteres)'
    case 'nombreCompleto':  return 'El nombre completo no es válido (máximo 100 caracteres)'
    case 'email':           return 'El email no tiene un formato válido'
    case 'fechaNacimiento': return 'La fecha de nacimiento debe ser una fecha pasada'
    default:                return raw // p.ej. "Email de usuario ya registrado"
  }
}

export default function Register() {
  const navigate = useNavigate()
  const setUsuario = useAuthStore((s) => s.setUsuario)
  const [form, setForm] = useState({
    nombreCompleto: '',
    nombreUsuario: '',
    email: '',
    contrasena: '',
    confirmarContrasena: '',
    fechaNacimiento: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (form.contrasena !== form.confirmarContrasena) {
      setError('Las contraseñas no coinciden')
      return
    }
    setError('')
    setLoading(true)
    try {
      const { nombreCompleto, nombreUsuario, email, contrasena, fechaNacimiento } = form
      const { data } = await register({ nombreCompleto, nombreUsuario, email, contrasena, fechaNacimiento })
      setUsuario(data)
      navigate('/')
    } catch (err: any) {
      setError(traducirErrorRegistro(err.response?.data?.error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex overflow-hidden">

      {/* ── Panel izquierdo (branding) ── */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col items-center justify-center p-14 relative overflow-hidden shrink-0"
        style={{ background: 'var(--gradient-brand)' }}
      >
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-[0.15]" style={{ background: 'white' }} />
        <div className="absolute -bottom-36 -right-20 w-[420px] h-[420px] rounded-full opacity-[0.08]" style={{ background: 'white' }} />
        <div className="absolute top-1/3 right-8 w-40 h-40 rounded-full opacity-[0.10]" style={{ background: 'white' }} />

        <div className="relative z-10 text-center text-white select-none">
          <p className="text-6xl font-bold tracking-tight mb-6">Nexly</p>
          <p className="text-xl font-medium opacity-90 mb-4">Tu espacio, tu comunidad.</p>
          <p className="text-sm opacity-90 max-w-[260px] leading-relaxed mx-auto">
            Crea tu cuenta y empieza a compartir lo que te importa.
          </p>
        </div>
      </div>

      {/* ── Panel derecho ── */}
      <div
        className="flex-1 flex items-center justify-center p-6 overflow-y-auto"
        style={{ background: 'var(--color-bg)' }}
      >
        <div
          className="w-full max-w-sm rounded-2xl p-8 shadow-md"
          style={{ background: 'var(--color-surface)' }}
        >
          <p className="lg:hidden text-center text-3xl font-bold mb-6" style={{ color: 'var(--color-brand)' }}>
            Nexly
          </p>

          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
            Crea tu cuenta
          </h2>
          <p className="text-sm mb-7" style={{ color: 'var(--color-muted)' }}>
            Es gratis y solo toma un momento
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Nombre completo */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none" style={{ color: 'var(--color-muted)' }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Nombre completo"
                required
                value={form.nombreCompleto}
                onChange={(e) => setForm({ ...form, nombreCompleto: e.target.value })}
                className="input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
              />
            </div>

            {/* Nombre de usuario */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none" style={{ color: 'var(--color-muted)' }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Nombre de usuario"
                required
                value={form.nombreUsuario}
                onChange={(e) => setForm({ ...form, nombreUsuario: e.target.value })}
                className="input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none" style={{ color: 'var(--color-muted)' }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
              />
            </div>

            {/* Contraseña */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none" style={{ color: 'var(--color-muted)' }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                type="password"
                placeholder="Contraseña"
                required
                value={form.contrasena}
                onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                className="input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
              />
            </div>

            {/* Confirmar contraseña */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none" style={{ color: 'var(--color-muted)' }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  <path d="M9 16l2 2 4-4" />
                </svg>
              </span>
              <input
                type="password"
                placeholder="Confirmar contraseña"
                required
                value={form.confirmarContrasena}
                onChange={(e) => setForm({ ...form, confirmarContrasena: e.target.value })}
                className="input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
              />
            </div>

            {/* Fecha de nacimiento */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none" style={{ color: 'var(--color-muted)' }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
              <input
                type="date"
                required
                max={new Date().toISOString().split('T')[0]}
                value={form.fechaNacimiento}
                onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
                className="input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
              />
            </div>

            {error && (
              <p className="text-xs px-1" style={{ color: 'var(--color-error)' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full rounded-xl py-3 text-sm mt-0.5"
            >
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>

          <p className="text-center text-sm mt-7" style={{ color: 'var(--color-muted)' }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold" style={{ color: 'var(--color-brand)' }}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
