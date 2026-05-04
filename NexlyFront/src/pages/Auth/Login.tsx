import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useState } from "react";
import { login } from "../../api/auth";

export default function Login() {
  const navigate = useNavigate()
  const setUsuario = useAuthStore((s) => s.setUsuario)
  const [form, setForm] = useState({ email: "", contrasenha: "" })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await login(form.email, form.contrasenha)
      setUsuario(data)
      navigate('/')
    } catch {
      setError('Email o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex overflow-hidden">

      {/* ── Panel izquierdo (branding) ── */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col items-center justify-center p-14 relative overflow-hidden shrink-0"
        style={{ background: 'linear-gradient(145deg, var(--color-brand-dark) 0%, var(--color-brand) 100%)' }}
      >
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-[0.15]" style={{ background: 'white' }} />
        <div className="absolute -bottom-36 -right-20 w-[420px] h-[420px] rounded-full opacity-[0.08]" style={{ background: 'white' }} />
        <div className="absolute top-1/3 right-8 w-40 h-40 rounded-full opacity-[0.10]" style={{ background: 'white' }} />

        <div className="relative z-10 text-center text-white select-none">
          <p className="text-6xl font-bold tracking-tight mb-6">Nexly</p>
          <p className="text-xl font-medium opacity-90 mb-4">Conecta. Comparte. Crece.</p>
          <p className="text-sm opacity-65 max-w-[260px] leading-relaxed mx-auto">
            Únete a miles de personas que ya comparten sus ideas y momentos.
          </p>
        </div>
      </div>

      {/* ── Panel derecho ── */}
      <div
        className="flex-1 flex items-center justify-center p-6 overflow-y-auto"
        style={{ background: 'var(--color-bg)' }}
      >
        {/* Card */}
        <div
          className="w-full max-w-sm rounded-2xl p-8 shadow-md"
          style={{ background: 'var(--color-surface)' }}
        >
          {/* Logo solo en mobile */}
          <p className="lg:hidden text-center text-3xl font-bold mb-6" style={{ color: 'var(--color-brand)' }}>
            Nexly
          </p>

          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
            Bienvenido de vuelta
          </h2>
          <p className="text-sm mb-7" style={{ color: 'var(--color-muted)' }}>
            Inicia sesión en tu cuenta
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

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
                value={form.contrasenha}
                onChange={(e) => setForm({ ...form, contrasenha: e.target.value })}
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
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>

            {/* Separador */}
            <p className="text-center text-xs my-1" style={{ color: 'var(--color-muted)' }}>
              o continúa con
            </p>

            {/* Google */}
            <a
              href="/oauth2/authorization/google"
              className="btn-outline flex items-center justify-center gap-2.5 rounded-xl py-3 text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuar con Google
            </a>
          </form>

          <p className="text-center text-sm mt-7" style={{ color: 'var(--color-muted)' }}>
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-semibold" style={{ color: 'var(--color-brand)' }}>
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
