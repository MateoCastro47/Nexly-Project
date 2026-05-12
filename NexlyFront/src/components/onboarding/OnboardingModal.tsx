import { useRef, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { completarOnboarding } from '../../api/usuario'
import { uploadImagen } from '../../api/media'

const STEPS = ['foto', 'info', 'privacidad'] as const
type Step = typeof STEPS[number]

const TITLES: Record<Step, string> = {
  foto:       'Tu imagen',
  info:       'Cuéntanos sobre ti',
  privacidad: 'Privacidad',
}

export default function OnboardingModal() {
  const usuario       = useAuthStore((s) => s.usuario!)
  const setUsuario    = useAuthStore((s) => s.setUsuario)
  const cerrarOnboarding = useAuthStore((s) => s.cerrarOnboarding)

  const [stepIndex, setStepIndex] = useState(0)
  const step = STEPS[stepIndex]

  const [form, setForm] = useState({
    fotoPerfil:   usuario.fotoPerfil   ?? '',
    fotoPortada:  usuario.fotoPortada  ?? '',
    biografia:    usuario.biografia    ?? '',
    ubicacion:    '',
    enlaceWeb:    '',
    perfilPrivado: false,
  })

  const [uploadingAvatar,  setUploadingAvatar]  = useState(false)
  const [uploadingPortada, setUploadingPortada] = useState(false)
  const [fotoError, setFotoError] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [loading,   setLoading]   = useState(false)

  const avatarInputRef  = useRef<HTMLInputElement>(null)
  const portadaInputRef = useRef<HTMLInputElement>(null)

  async function handleAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    setUploadError(null)
    try {
      const url = await uploadImagen(file, 'perfiles')
      setForm((f) => ({ ...f, fotoPerfil: url }))
      setFotoError(false)
    } catch {
      setUploadError('No se pudo subir la imagen. Inténtalo de nuevo.')
    } finally {
      setUploadingAvatar(false)
    }
  }

  async function handlePortadaFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPortada(true)
    setUploadError(null)
    try {
      const url = await uploadImagen(file, 'portadas')
      setForm((f) => ({ ...f, fotoPortada: url }))
    } catch {
      setUploadError('No se pudo subir la imagen. Inténtalo de nuevo.')
    } finally {
      setUploadingPortada(false)
    }
  }

  async function submit(skip = false) {
    setLoading(true)
    try {
      const payload = skip ? {} : {
        fotoPerfil:    form.fotoPerfil   || undefined,
        fotoPortada:   form.fotoPortada  || undefined,
        biografia:     form.biografia    || undefined,
        ubicacion:     form.ubicacion    || undefined,
        enlaceWeb:     form.enlaceWeb    || undefined,
        perfilPrivado: form.perfilPrivado,
      }
      const { data } = await completarOnboarding(payload)
      setUsuario(data)
      cerrarOnboarding()
    } finally {
      setLoading(false)
    }
  }

  const isLast = stepIndex === STEPS.length - 1

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: 'var(--color-overlay)', zIndex: 'var(--z-modal)' }}
    >
      <div
        className="card w-full max-w-lg flex flex-col gap-6 p-8"
        style={{ animation: 'scaleIn 0.22s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        {/* Cabecera */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2
              className="text-xl font-bold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
            >
              {TITLES[step]}
            </h2>
            <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
              {stepIndex + 1} / {STEPS.length}
            </span>
          </div>
          {/* Barra de progreso */}
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{
                  background: i <= stepIndex
                    ? 'var(--gradient-brand)'
                    : 'var(--color-border)',
                }}
              />
            ))}
          </div>
        </div>

        <div className="divider-brand" />

        {/* ── Paso 1: Foto ── */}
        {step === 'foto' && (
          <div className="flex flex-col gap-5">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                Foto de perfil
              </p>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="relative group"
                disabled={uploadingAvatar}
              >
                <div className="avatar-ring">
                  {form.fotoPerfil && !fotoError ? (
                    <img
                      src={form.fotoPerfil}
                      alt=""
                      onError={() => setFotoError(true)}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                      style={{ background: 'var(--color-accent-1-dark)' }}
                    >
                      {usuario.nombreCompleto[0].toUpperCase()}
                    </div>
                  )}
                </div>
                {/* Overlay cámara */}
                <div
                  className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'oklch(0 0 0 / 0.45)' }}
                >
                  {uploadingAvatar ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  )}
                </div>
              </button>
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
              {uploadError && (
                <p className="text-xs" style={{ color: 'var(--color-error)' }}>{uploadError}</p>
              )}
            </div>

            {/* Foto de portada */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" style={{ color: 'var(--color-text-2)' }}>
                Foto de portada <span style={{ color: 'var(--color-muted)' }}>(opcional)</span>
              </label>
              <div
                className="relative w-full h-24 rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer group border-2 border-dashed transition-colors"
                style={{ borderColor: 'var(--color-border)' }}
                onClick={() => portadaInputRef.current?.click()}
              >
                {form.fotoPortada ? (
                  <img src={form.fotoPortada} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
                    Subir imagen
                  </span>
                )}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'oklch(0 0 0 / 0.35)' }}
                >
                  {uploadingPortada ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  )}
                </div>
              </div>
              <input ref={portadaInputRef} type="file" accept="image/*" className="hidden" onChange={handlePortadaFile} />
            </div>
          </div>
        )}

        {/* ── Paso 2: Info ── */}
        {step === 'info' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <label className="text-sm font-medium" style={{ color: 'var(--color-text-2)' }}>
                  Biografía
                </label>
                <span className="text-xs" style={{ color: form.biografia.length > 140 ? 'var(--color-error)' : 'var(--color-muted)' }}>
                  {form.biografia.length}/160
                </span>
              </div>
              <textarea
                className="input w-full resize-none px-3 py-2.5 text-sm rounded-xl"
                rows={3}
                maxLength={160}
                placeholder="Cuéntanos algo sobre ti..."
                value={form.biografia}
                onChange={(e) => setForm((f) => ({ ...f, biografia: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--color-text-2)' }}>
                Ubicación
              </label>
              <input
                type="text"
                className="input w-full px-3 py-2.5 text-sm rounded-xl"
                maxLength={100}
                placeholder="Ciudad, País"
                value={form.ubicacion}
                onChange={(e) => setForm((f) => ({ ...f, ubicacion: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--color-text-2)' }}>
                Sitio web
              </label>
              <input
                type="url"
                className="input w-full px-3 py-2.5 text-sm rounded-xl"
                maxLength={200}
                placeholder="https://tu-sitio.com"
                value={form.enlaceWeb}
                onChange={(e) => setForm((f) => ({ ...f, enlaceWeb: e.target.value }))}
              />
            </div>
          </div>
        )}

        {/* ── Paso 3: Privacidad ── */}
        {step === 'privacidad' && (
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
              Con un perfil privado solo tus seguidores aprobados podrán ver tus publicaciones.
            </p>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, perfilPrivado: !f.perfilPrivado }))}
              className="flex items-center justify-between p-4 rounded-2xl border transition-all"
              style={{
                border: `1.5px solid ${form.perfilPrivado ? 'var(--color-accent-1)' : 'var(--color-border)'}`,
                background: form.perfilPrivado ? 'var(--color-accent-1-tint)' : 'var(--color-surface)',
              }}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ color: form.perfilPrivado ? 'var(--color-accent-1)' : 'var(--color-muted)' }}>
                  {form.perfilPrivado
                    ? <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>
                    : <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></>
                  }
                </svg>
                <div className="text-left">
                  <p className="text-sm font-semibold" style={{ color: form.perfilPrivado ? 'var(--color-accent-1)' : 'var(--color-text)' }}>
                    {form.perfilPrivado ? 'Perfil privado' : 'Perfil público'}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                    {form.perfilPrivado ? 'Solo seguidores aprobados' : 'Cualquiera puede ver tu perfil'}
                  </p>
                </div>
              </div>
              {/* Toggle visual */}
              <div
                className="w-11 h-6 rounded-full transition-colors relative shrink-0"
                style={{ background: form.perfilPrivado ? 'var(--color-accent-1)' : 'var(--color-border)' }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                  style={{ transform: form.perfilPrivado ? 'translateX(22px)' : 'translateX(2px)' }}
                />
              </div>
            </button>
          </div>
        )}

        <div className="divider-brand" />

        {/* Acciones */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            className="text-sm px-4 py-2 rounded-xl transition-colors"
            style={{ color: 'var(--color-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
            onClick={() => submit(true)}
            disabled={loading}
          >
            Completar después
          </button>

          <div className="flex gap-2">
            {stepIndex > 0 && (
              <button
                type="button"
                className="btn-outline px-5 py-2 text-sm"
                onClick={() => setStepIndex((i) => i - 1)}
                disabled={loading}
              >
                Atrás
              </button>
            )}
            <button
              type="button"
              className="btn-primary px-6 py-2 text-sm"
              onClick={isLast ? () => submit(false) : () => setStepIndex((i) => i + 1)}
              disabled={loading || uploadingAvatar || uploadingPortada}
            >
              {loading
                ? 'Guardando...'
                : isLast
                  ? 'Finalizar'
                  : 'Continuar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
