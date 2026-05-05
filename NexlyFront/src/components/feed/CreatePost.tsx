import { useRef, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useFeedStore } from '../../store/feedStore'
import { uploadImagen } from '../../api/media'
import EmojiPicker from './EmojiPicker'

type Visibilidad  = 'PUBLICA' | 'SEGUIDORES' | 'PRIVADA'
type ActivePanel  = null | 'emoji' | 'poll'

const VISIBILIDAD_OPTS: { value: Visibilidad; label: string; icon: string }[] = [
  { value: 'PUBLICA',    label: 'Todos',      icon: '🌍' },
  { value: 'SEGUIDORES', label: 'Seguidores', icon: '👥' },
  { value: 'PRIVADA',    label: 'Solo yo',    icon: '🔒' },
]

const MAX_CHARS   = 280
const WARN_CHARS  = 56
const RING_SIZE   = 24

// ── Contador circular ────────────────────────────────────────────────────────

function CharRing({ count }: { count: number }) {
  const pct  = Math.min(count / MAX_CHARS, 1)
  const over = count > MAX_CHARS
  const r    = (RING_SIZE - 4) / 2
  const circ = 2 * Math.PI * r
  const dash = circ * (1 - pct)

  if (count === 0) return null

  const color = over
    ? 'var(--color-error)'
    : count >= MAX_CHARS - WARN_CHARS
    ? 'var(--color-warning)'
    : 'var(--color-accent-1)'

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
      <svg width={RING_SIZE} height={RING_SIZE} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={r} fill="none" strokeWidth="2.5"
          style={{ stroke: 'var(--color-border)' }} />
        <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={r} fill="none" strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            stroke: color,
            strokeDasharray: circ,
            strokeDashoffset: dash,
            transition: 'stroke-dashoffset 0.25s, stroke 0.25s',
          }}
        />
      </svg>
      {count >= MAX_CHARS - WARN_CHARS && (
        <span
          className="absolute text-[9px] font-bold tabular-nums leading-none"
          style={{ color: over ? 'var(--color-error)' : 'var(--color-muted)' }}
        >
          {MAX_CHARS - count}
        </span>
      )}
    </div>
  )
}

// ── Previsualización de imagen ───────────────────────────────────────────────

interface ImagenPreview {
  id: string
  previewUrl: string   // object URL local para mostrar inmediatamente
  uploadedUrl: string  // URL de Cloudinary (vacía mientras sube)
  uploading: boolean
  error: boolean
}

function ImagenGrid({ imagenes, onRemove }: { imagenes: ImagenPreview[]; onRemove: (id: string) => void }) {
  if (imagenes.length === 0) return null

  const cols = imagenes.length === 1 ? 1 : 2

  return (
    <div className={`grid gap-1.5 rounded-2xl overflow-hidden ${cols === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {imagenes.map((img) => (
        <div key={img.id} className="relative group rounded-xl overflow-hidden">
          <img
            src={img.previewUrl}
            alt=""
            className="w-full object-cover"
            style={{ maxHeight: imagenes.length === 1 ? '20rem' : '10rem' }}
          />
          {/* Overlay de carga */}
          {img.uploading && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'oklch(0 0 0 / 0.40)', backdropFilter: 'blur(2px)' }}>
              <div
                className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'white', borderTopColor: 'transparent' }}
              />
            </div>
          )}
          {/* Error */}
          {img.error && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'oklch(0 0 0 / 0.50)', backdropFilter: 'blur(2px)' }}>
              <span className="text-white text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: 'var(--color-error)' }}>
                Error al subir
              </span>
            </div>
          )}
          {/* Botón quitar */}
          <button
            onClick={() => onRemove(img.id)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
            style={{
              background: 'oklch(0 0 0 / 0.60)',
              backdropFilter: 'blur(4px)',
              color: 'white',
            }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}

// ── Creador de encuesta ──────────────────────────────────────────────────────

function PollCreator({
  opts,
  onChange,
  onClose,
}: {
  opts: string[]
  onChange: (opts: string[]) => void
  onClose: () => void
}) {
  const update = (i: number, val: string) => {
    const next = [...opts]
    next[i] = val
    onChange(next)
  }

  const remove = (i: number) => onChange(opts.filter((_, idx) => idx !== i))
  const add    = () => { if (opts.length < 4) onChange([...opts, '']) }

  return (
    <div
      className="flex flex-col gap-2.5 p-4 rounded-2xl"
      style={{
        background: 'var(--color-surface-3)',
        border: '1px solid color-mix(in oklch, var(--color-border), var(--color-accent-1) 10%)',
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--color-accent-1)' }}>
          📊 Encuesta
        </span>
        <button onClick={onClose} className="text-xs font-semibold transition-colors" style={{ color: 'var(--color-muted)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-error)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
        >
          Quitar
        </button>
      </div>

      {opts.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={opt}
            onChange={(e) => update(i, e.target.value)}
            placeholder={`Opción ${i + 1}`}
            maxLength={80}
            className="input flex-1 px-3 py-2 text-sm rounded-xl"
          />
          {opts.length > 2 && (
            <button
              onClick={() => remove(i)}
              className="shrink-0 p-1.5 rounded-full transition-all"
              style={{ color: 'var(--color-muted)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--color-error)';
                (e.currentTarget as HTMLElement).style.background = 'oklch(0.62 0.24 28 / 0.08)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--color-muted)';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      ))}

      {opts.length < 4 && (
        <button
          onClick={add}
          className="text-xs font-bold text-left px-1 transition-colors"
          style={{ color: 'var(--color-accent-1)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-1-dark)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-accent-1)')}
        >
          + Agregar opción
        </button>
      )}
    </div>
  )
}

// ── CreatePost ───────────────────────────────────────────────────────────────

export default function CreatePost() {
  const usuario = useAuthStore((s) => s.usuario)
  const crear   = useFeedStore((s) => s.crear)

  const [contenido,    setContenido]    = useState('')
  const [visibilidad,  setVisibilidad]  = useState<Visibilidad>('PUBLICA')
  const [loading,      setLoading]      = useState(false)
  const [focused,      setFocused]      = useState(false)
  const [imagenes,     setImagenes]     = useState<ImagenPreview[]>([])
  const [pollOpts,     setPollOpts]     = useState<string[]>(['', ''])
  const [showPoll,     setShowPoll]     = useState(false)
  const [activePanel,  setActivePanel]  = useState<ActivePanel>(null)

  const taRef       = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!usuario) return null

  const expanded   = focused || contenido.length > 0 || imagenes.length > 0 || showPoll
  const uploading  = imagenes.some((i) => i.uploading)
  const hasError   = imagenes.some((i) => i.error)

  const pollValidas = showPoll ? pollOpts.filter((o) => o.trim().length > 0) : []
  const canSubmit  = contenido.trim().length > 0
    && contenido.length <= MAX_CHARS
    && !loading
    && !uploading
    && !hasError
    && (!showPoll || pollValidas.length >= 2)

  // ── Insertar emoji en cursor ─────────────────────────────────────────────

  const insertEmoji = (emoji: string) => {
    const ta = taRef.current
    if (!ta) { setContenido((c) => c + emoji); return }
    const start = ta.selectionStart ?? contenido.length
    const end   = ta.selectionEnd   ?? contenido.length
    const next  = contenido.slice(0, start) + emoji + contenido.slice(end)
    setContenido(next)
    requestAnimationFrame(() => {
      ta.focus()
      ta.selectionStart = ta.selectionEnd = start + emoji.length
    })
  }

  // ── Imagen: selección y upload ───────────────────────────────────────────

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 4 - imagenes.length)
    if (files.length === 0) return

    const nuevas: ImagenPreview[] = files.map((f) => ({
      id: crypto.randomUUID(),
      previewUrl: URL.createObjectURL(f),
      uploadedUrl: '',
      uploading: true,
      error: false,
    }))
    setImagenes((prev) => [...prev, ...nuevas])
    if (fileInputRef.current) fileInputRef.current.value = ''

    await Promise.all(
      files.map(async (file, i) => {
        const id = nuevas[i].id
        try {
          const url = await uploadImagen(file)
          setImagenes((prev) =>
            prev.map((img) => img.id === id ? { ...img, uploadedUrl: url, uploading: false } : img)
          )
        } catch {
          setImagenes((prev) =>
            prev.map((img) => img.id === id ? { ...img, uploading: false, error: true } : img)
          )
        }
      })
    )
  }

  const removeImagen = (id: string) => {
    setImagenes((prev) => {
      const img = prev.find((i) => i.id === id)
      if (img) URL.revokeObjectURL(img.previewUrl)
      return prev.filter((i) => i.id !== id)
    })
  }

  // ── Toggle paneles (cierra si clickeas el mismo) ─────────────────────────

  const togglePanel = (panel: ActivePanel) =>
    setActivePanel((prev) => (prev === panel ? null : panel))

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!canSubmit) return
    setLoading(true)

    let textoFinal = contenido.trim()
    if (showPoll && pollValidas.length >= 2) {
      textoFinal += '\n\n📊 Encuesta\n' + pollValidas.map((o) => `• ${o}`).join('\n')
    }

    try {
      await crear({
        contenido: textoFinal,
        visibilidad,
        imagenes: imagenes.map((i) => i.uploadedUrl).filter(Boolean),
      })
      setContenido('')
      setImagenes([])
      setPollOpts(['', ''])
      setShowPoll(false)
      setFocused(false)
      setActivePanel(null)
    } finally {
      setLoading(false)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className="px-5 pt-5 pb-3 flex flex-col gap-0 cursor-text rounded-3xl relative"
      style={{
        background: 'linear-gradient(180deg, var(--color-surface), var(--color-surface-2))',
        border: '1px solid color-mix(in oklch, var(--color-border), var(--color-brand) 12%)',
        boxShadow: focused 
          ? '0 18px 44px oklch(0 0 0 / 0.16), 0 6px 12px oklch(0 0 0 / 0.08)' 
          : 'var(--shadow-card)',
        borderColor: focused
          ? 'color-mix(in oklch, var(--color-border), var(--color-brand) 30%)'
          : undefined,
        transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
      }}
      onClick={() => taRef.current?.focus()}
    >
      {/* Fila principal */}
      <div className="flex gap-3">
        {/* Avatar */}
        {usuario.fotoPerfil ? (
          <div className="avatar-ring shrink-0 mt-0.5">
            <img src={usuario.fotoPerfil} alt="" className="w-10 h-10 rounded-full object-cover" />
          </div>
        ) : (
          <div className="avatar-ring shrink-0 mt-0.5">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: 'var(--color-accent-1-dark)' }}
            >
              {usuario.nombreCompleto[0].toUpperCase()}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {/* Textarea */}
          <textarea
            ref={taRef}
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => { if (!contenido && imagenes.length === 0 && !showPoll) setFocused(false) }}
            placeholder="¿Qué está pasando?"
            rows={expanded ? 3 : 1}
            className="w-full resize-none bg-transparent outline-none leading-relaxed"
            style={{
              fontSize: expanded ? '1rem' : '0.9375rem',
              color: 'var(--color-text)',
              caretColor: 'var(--color-accent-1)',
              fontFamily: expanded ? 'var(--font-body)' : undefined,
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit()
            }}
          />

          {/* Imágenes adjuntas */}
          <ImagenGrid imagenes={imagenes} onRemove={removeImagen} />

          {/* Encuesta */}
          {showPoll && (
            <PollCreator
              opts={pollOpts}
              onChange={setPollOpts}
              onClose={() => { setShowPoll(false); setPollOpts(['', '']) }}
            />
          )}
        </div>
      </div>

      {/* Divisor */}
      <div className="divider-brand mt-3 mb-2 -mx-5" />

      {/* Toolbar */}
      <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
        {/* Iconos de acción */}
        <div className="flex items-center gap-1 -ml-1">

          {/* Imagen */}
          <div className="relative">
            <button
              type="button"
              className="action-btn p-2.5 rounded-xl"
              title="Imagen o vídeo"
              disabled={imagenes.length >= 4}
              onClick={() => fileInputRef.current?.click()}
              style={{ border: 'none', boxShadow: 'none' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* Encuesta */}
          <button
            type="button"
            className="action-btn p-2.5 rounded-xl"
            title="Encuesta"
            onClick={() => { setShowPoll((v) => !v); setActivePanel(null) }}
            style={{
              border: 'none',
              boxShadow: 'none',
              ...(showPoll ? {
                background: 'var(--color-accent-1-tint)',
                color: 'var(--color-accent-1)',
              } : {}),
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4"  />
              <line x1="6"  y1="20" x2="6"  y2="14" />
            </svg>
          </button>

          {/* Emoji */}
          <div className="relative">
            <button
              type="button"
              className="action-btn p-2.5 rounded-xl"
              title="Emoji"
              onClick={() => togglePanel('emoji')}
              style={{
                border: 'none',
                boxShadow: 'none',
                ...(activePanel === 'emoji' ? {
                  background: 'var(--color-accent-1-tint)',
                  color: 'var(--color-accent-1)',
                } : {}),
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 13s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
            {activePanel === 'emoji' && (
              <EmojiPicker onSelect={insertEmoji} onClose={() => setActivePanel(null)} />
            )}
          </div>

          {/* Separador */}
          <div className="w-px h-5 mx-1.5 shrink-0" style={{ background: 'var(--color-border)' }} />

          {/* Visibilidad */}
          <select
            value={visibilidad}
            onChange={(e) => setVisibilidad(e.target.value as Visibilidad)}
            className="text-xs px-3 py-1.5 rounded-full font-bold border-none outline-none cursor-pointer transition-colors"
            style={{
              color: 'var(--color-accent-1)',
              background: 'var(--color-accent-1-tint)',
            }}
          >
            {VISIBILIDAD_OPTS.map(({ value, label, icon }) => (
              <option key={value} value={value}>{icon} {label}</option>
            ))}
          </select>
        </div>

        {/* Contador + botón */}
        <div className="flex items-center gap-3">
          <CharRing count={contenido.length} />

          {expanded && (
            <div className="w-px h-5 shrink-0" style={{ background: 'var(--color-border)' }} />
          )}

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="btn-primary px-6 py-2 rounded-full text-sm"
          >
            {loading ? 'Publicando…' : uploading ? 'Subiendo…' : 'Publicar'}
          </button>
        </div>
      </div>
    </div>
  )
}
