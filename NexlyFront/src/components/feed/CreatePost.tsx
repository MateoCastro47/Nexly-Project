import { useRef, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useFeedStore } from '../../store/feedStore'
import { uploadImagen } from '../../api/media'
import { crearPublicacion } from '../../api/Publicaciones'
import EmojiPicker from './EmojiPicker'
import QuoteCard from './QuoteCard'
import SelectPill from './SelectPill'
import type { SelectOption } from './SelectPill'
import type { Publicacion, TipoPost } from '../../types'


type Visibilidad  = 'PUBLICA' | 'SEGUIDORES' | 'PRIVADA'
type ActivePanel  = null | 'emoji'

const VISIBILIDAD_OPTS: SelectOption[] = [
  { value: 'PUBLICA',    label: 'Todos',      icon: '🌍', color: 'oklch(0.50 0.18 150)',  bg: 'oklch(0.50 0.18 150 / 0.12)' },
  { value: 'SEGUIDORES', label: 'Seguidores', icon: '👥', color: 'var(--color-accent-1)', bg: 'var(--color-accent-1-tint)' },
  { value: 'PRIVADA',    label: 'Solo yo',    icon: '🔒', color: 'var(--color-muted)',    bg: 'oklch(0.50 0 0 / 0.08)' },
]

const FLAIR_OPTS: SelectOption[] = [
  { value: 'NORMAL',   label: 'Tipo de post', icon: '🏷️', color: 'var(--color-muted)',    bg: 'oklch(0.50 0 0 / 0.07)' },
  { value: 'PREGUNTA', label: 'Pregunta',     icon: '❓',  color: 'var(--color-accent-1)', bg: 'var(--color-accent-1-tint)' },
  { value: 'NOTICIA',  label: 'Noticia',      icon: '📰', color: 'oklch(0.50 0.18 150)',  bg: 'oklch(0.50 0.18 150 / 0.12)' },
  { value: 'DEBATE',   label: 'Debate',       icon: '⚡',  color: 'oklch(0.60 0.20 50)',   bg: 'oklch(0.60 0.20 50 / 0.12)' },
  { value: 'ANUNCIO',  label: 'Anuncio',      icon: '📣', color: 'oklch(0.52 0.22 300)',  bg: 'oklch(0.52 0.22 300 / 0.12)' },
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

// ── CreatePost ───────────────────────────────────────────────────────────────
interface CreatePostProps {
  comunidadId?: number
  comunidadNombre?: string
  onCreated?: (publicacion: Publicacion) => void
}

export default function CreatePost({comunidadId, comunidadNombre, onCreated }: CreatePostProps = {}) {
  const usuario     = useAuthStore((s) => s.usuario)
  const crear       = useFeedStore((s) => s.crear)
  const postCitado  = useFeedStore((s) => s.postCitado)
  const setCitando  = useFeedStore((s) => s.setCitando)

  const enComunidad = comunidadId != null;
  const citaActiva = enComunidad ? null : postCitado

  const [contenido,    setContenido]    = useState('')
  const [visibilidad,  setVisibilidad]  = useState<Visibilidad>('PUBLICA')
  const [tipoPost,     setTipoPost]     = useState<TipoPost>('NORMAL')
  const [loading,      setLoading]      = useState(false)
  const [focused,      setFocused]      = useState(false)
  const [imagenes,     setImagenes]     = useState<ImagenPreview[]>([])
  const [activePanel,  setActivePanel]  = useState<ActivePanel>(null)

  const taRef       = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!usuario) return null

  const expanded   = focused || contenido.length > 0 || imagenes.length > 0 || !!citaActiva || tipoPost !== 'NORMAL'
  const uploading  = imagenes.some((i) => i.uploading)
  const hasError   = imagenes.some((i) => i.error)

  const canSubmit  = contenido.trim().length > 0
    && contenido.length <= MAX_CHARS
    && !loading
    && !uploading
    && !hasError

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

    const textoFinal = contenido.trim()
    const imagenesUrls = imagenes.map((i) => i.uploadedUrl).filter(Boolean)
    const tipoFinal = tipoPost !== 'NORMAL' ? tipoPost : undefined

    try {
      if (enComunidad) {
      const { data: nueva } = await crearPublicacion({
        contenido: textoFinal,
        visibilidad: 'PUBLICA',
        tipoPost: tipoFinal,
        comunidadId,
        imagenes: imagenesUrls,
      })
        onCreated?.(nueva)
      } else {
        await crear({
          contenido: textoFinal,
          visibilidad,
          tipoPost: tipoFinal,
          publicacionRefId: citaActiva?.id,
          imagenes: imagenesUrls,
        })
        setCitando(null)
      }
      setContenido('')
      setImagenes([])
      setFocused(false)
      setActivePanel(null)
      setTipoPost('NORMAL')
    } finally {
      setLoading(false)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3 flex flex-col gap-0 cursor-text rounded-3xl relative"
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
      onBlur={(e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node)) return
        if (!contenido && imagenes.length === 0 && !citaActiva && tipoPost === 'NORMAL') setFocused(false)
      }}
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
          {enComunidad && comunidadNombre && (
            <div className='flex items-center gap-1.5 text-xs font-semibold w-fit px-2.5 py-1 rounded-full'
            style={{background: 'var(--color-accent-1-tint)', color: 'var(--color-accent-1)' }}>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              <span>Publicando en {comunidadNombre}</span>
            </div>
          )}
          {/* Textarea */}
          <textarea
            ref={taRef}
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            onFocus={() => setFocused(true)}
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

          {/* Preview del post citado */}
          {citaActiva && (
            <div className="relative">
              <button
                onClick={() => setCitando(null)}
                className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                style={{ background: 'var(--color-muted)' }}
                title="Quitar cita"
              >
                ✕
              </button>
              <QuoteCard post={{
                id: citaActiva.id,
                contenido: citaActiva.contenido,
                autor: citaActiva.autor,
                imagenes: citaActiva.imagenes,
                fechaCreacion: citaActiva.fechaCreacion,
              }} />
            </div>
          )}

        </div>
      </div>

      {/* Divisor */}
      <div className="divider-brand mt-3 mb-2 -mx-4 sm:-mx-5" />

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
        {/* Iconos de acción */}
        <div className="flex items-center gap-0.5 sm:gap-1 -ml-1 flex-wrap">

          {/* Imagen */}
          <div className="relative">
            <button
              type="button"
              className="action-btn p-2 sm:p-2.5 rounded-xl"
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

          {/* Emoji */}
          <div className="relative">
            <button
              type="button"
              className="action-btn p-2 sm:p-2.5 rounded-xl"
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
          <div className="hidden sm:block w-px h-5 mx-1.5 shrink-0" style={{ background: 'var(--color-border)' }} />

          {/* Visibilidad */}
          {!enComunidad && ( <SelectPill
            value={visibilidad}
            onChange={(v) => setVisibilidad(v as Visibilidad)}
            options={VISIBILIDAD_OPTS}
          />)}

          {/* Flair — solo cuando el compositor está expandido */}
          {expanded && (
            <SelectPill
              value={tipoPost}
              onChange={(v) => setTipoPost(v as TipoPost)}
              options={FLAIR_OPTS}
              neutralValue="NORMAL"
            />
          )}
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
            className="btn-primary px-4 sm:px-6 py-2 rounded-full text-sm"
          >
            {loading ? 'Publicando…' : uploading ? 'Subiendo…' : 'Publicar'}
          </button>
        </div>
      </div>
    </div>
  )
}
