import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useComentariosStore } from '../../store/comentariosStore'
import type { Comentario } from '../../types'

function tiempoRelativo(fecha: string) {
  const diff = Date.now() - new Date(fecha).getTime()
  const min  = Math.floor(diff / 60_000)
  const h    = Math.floor(diff / 3_600_000)
  const d    = Math.floor(diff / 86_400_000)
  if (min < 1) return 'ahora'
  if (min < 60) return `${min}m`
  if (h < 24)   return `${h}h`
  if (d < 7)    return `${d}d`
  return new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

// ── CommentInput ──────────────────────────────────────────────────────────────

function CommentInput({
  pubId,
  padreId,
  placeholder = '¿Qué piensas?',
  autoFocus = false,
  onSubmitted,
}: {
  pubId: number
  padreId?: number
  placeholder?: string
  autoFocus?: boolean
  onSubmitted?: () => void
}) {
  const usuario   = useAuthStore((s) => s.usuario)
  const comentar  = useComentariosStore((s) => s.comentar)
  const responder = useComentariosStore((s) => s.responder)
  const enviando  = useComentariosStore((s) => s.byPost[pubId]?.enviando ?? false)
  const [texto, setTexto] = useState('')
  const taRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { if (autoFocus) taRef.current?.focus() }, [autoFocus])

  if (!usuario) return null
  const canSubmit = texto.trim().length > 0 && !enviando

  const handleSubmit = async () => {
    if (!canSubmit) return
    if (padreId != null) await responder(pubId, padreId, texto.trim())
    else await comentar(pubId, texto.trim())
    setTexto('')
    onSubmitted?.()
  }

  return (
    <div className="flex gap-2.5 items-start">
      {usuario.fotoPerfil ? (
        <img src={usuario.fotoPerfil} alt="" className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" />
      ) : (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
          style={{ background: 'var(--color-accent-1-dark)' }}
        >
          {usuario.nombreCompleto[0].toUpperCase()}
        </div>
      )}
      <div className="flex-1 flex items-end gap-2">
        <textarea
          ref={taRef}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={placeholder}
          rows={1}
          className="flex-1 resize-none rounded-2xl px-3.5 py-2 text-sm outline-none leading-relaxed"
          style={{
            background: 'var(--color-surface-3)',
            border: '1.5px solid var(--color-border)',
            color: 'var(--color-text)',
            caretColor: 'var(--color-accent-1)',
            minHeight: '36px',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-1)')}
          onBlur={(e)  => (e.currentTarget.style.borderColor = 'var(--color-border)')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }
          }}
        />
        {canSubmit && (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="btn-primary shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold"
          >
            {enviando ? '…' : 'Enviar'}
          </button>
        )}
      </div>
    </div>
  )
}

// ── CommentItem ───────────────────────────────────────────────────────────────

function CommentItem({
  comentario,
  pubId,
  depth = 0,
}: {
  comentario: Comentario
  pubId: number
  depth?: number
}) {
  const usuario          = useAuthStore((s) => s.usuario)
  const eliminar         = useComentariosStore((s) => s.eliminar)
  const toggleReaccion   = useComentariosStore((s) => s.toggleReaccion)
  const cargarRespuestas = useComentariosStore((s) => s.cargarRespuestas)
  const repliesState     = useComentariosStore((s) => s.byPost[pubId]?.respuestas[comentario.id])

  const [fotoError,      setFotoError]      = useState(false)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [showReplies,    setShowReplies]    = useState(false)

  const esPropio        = usuario?.id === comentario.autor.id
  const liked           = !!comentario.reaccion
  const totalRespuestas = comentario.conteoRespuestas || (repliesState?.items.length ?? 0)

  const handleExpandReplies = () => {
    if (!showReplies && !repliesState) cargarRespuestas(pubId, comentario.id)
    setShowReplies((v) => !v)
  }

  return (
    <div className={`flex gap-2.5 ${depth > 0 ? 'ml-9' : ''}`}>
      {/* Avatar */}
      <div className="shrink-0 mt-0.5">
        {comentario.autor.fotoPerfil && !fotoError ? (
          <img
            src={comentario.autor.fotoPerfil}
            alt=""
            className="w-7 h-7 rounded-full object-cover"
            onError={() => setFotoError(true)}
          />
        ) : (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'var(--color-accent-1-dark)' }}
          >
            {comentario.autor.nombreCompleto[0].toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        {/* Burbuja de contenido */}
        <div
          className="inline-block max-w-full px-3.5 py-2.5 rounded-2xl rounded-tl-sm"
          style={{ background: 'var(--color-surface-3)' }}
        >
          <div className="flex items-baseline gap-1.5 mb-0.5 flex-wrap">
            <span className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
              {comentario.autor.nombreCompleto}
            </span>
            <span className="text-[10px]" style={{ color: 'var(--color-muted)' }}>
              @{comentario.autor.nombreUsuario}
            </span>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text)' }}>
            {comentario.contenido}
          </p>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-1.5 px-1 flex-wrap">
          <span className="text-[11px]" style={{ color: 'var(--color-muted)' }}>
            {tiempoRelativo(comentario.fechaCreacion)}
          </span>

          {/* Corazón */}
          <button
            onClick={() => toggleReaccion(pubId, comentario.id, 'ME_GUSTA', comentario.comentarioPadreId)}
            className="flex items-center gap-1 text-[11px] font-semibold transition-colors"
            style={{ color: liked ? '#e17055' : 'var(--color-muted)' }}
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: liked ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1), fill 0.15s',
              }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {comentario.conteoReacciones > 0 && <span>{comentario.conteoReacciones}</span>}
          </button>

          {/* Responder — solo en primer nivel */}
          {depth === 0 && (
            <button
              onClick={() => setShowReplyInput((v) => !v)}
              className="text-[11px] font-semibold transition-colors"
              style={{ color: showReplyInput ? 'var(--color-accent-1)' : 'var(--color-muted)' }}
            >
              Responder
            </button>
          )}

          {/* Eliminar */}
          {esPropio && (
            <button
              onClick={() => eliminar(pubId, comentario.id, comentario.comentarioPadreId)}
              className="text-[11px] font-semibold transition-colors"
              style={{ color: 'var(--color-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-error)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
            >
              Eliminar
            </button>
          )}
        </div>

        {/* Input de respuesta */}
        {showReplyInput && (
          <div className="mt-2.5">
            <CommentInput
              pubId={pubId}
              padreId={comentario.id}
              placeholder={`Responder a ${comentario.autor.nombreCompleto}…`}
              autoFocus
              onSubmitted={() => {
                setShowReplyInput(false)
                if (!showReplies) {
                  setShowReplies(true)
                  if (!repliesState) cargarRespuestas(pubId, comentario.id)
                }
              }}
            />
          </div>
        )}

        {/* Ver respuestas */}
        {depth === 0 && totalRespuestas > 0 && (
          <button
            onClick={handleExpandReplies}
            className="flex items-center gap-1 text-[11px] font-semibold mt-2 px-1"
            style={{ color: 'var(--color-accent-1)' }}
          >
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <polyline points={showReplies ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
            </svg>
            {showReplies
              ? 'Ocultar respuestas'
              : `Ver ${totalRespuestas} respuesta${totalRespuestas !== 1 ? 's' : ''}`}
          </button>
        )}

        {/* Respuestas expandidas */}
        {showReplies && (
          <div className="mt-3 flex flex-col gap-3">
            {repliesState?.loading && (
              <div className="flex gap-2.5 ml-9">
                <div className="skeleton w-7 h-7 rounded-full shrink-0" />
                <div className="flex-1 flex flex-col gap-1.5 pt-1">
                  <div className="skeleton h-3 w-24 rounded-full" />
                  <div className="skeleton h-3 w-3/4 rounded-full" />
                </div>
              </div>
            )}
            {(repliesState?.items ?? []).map((r) => (
              <CommentItem key={r.id} comentario={r} pubId={pubId} depth={1} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── CommentSection ────────────────────────────────────────────────────────────

export default function CommentSection({ pubId }: { pubId: number }) {
  const cargar    = useComentariosStore((s) => s.cargar)
  const cargarMas = useComentariosStore((s) => s.cargarMas)
  const state     = useComentariosStore((s) => s.byPost[pubId])

  useEffect(() => { if (!state) cargar(pubId) }, [pubId])

  const comentarios = state?.comentarios ?? []
  const loading     = state?.loading     ?? false
  const hayMas      = state?.hayMas      ?? false

  return (
    <div className="flex flex-col gap-3 pt-1">
      <CommentInput pubId={pubId} placeholder="Escribe un comentario…" />

      {loading && comentarios.length === 0 && (
        <div className="flex flex-col gap-3 mt-1">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-2.5">
              <div className="skeleton w-7 h-7 rounded-full shrink-0" />
              <div className="flex-1 flex flex-col gap-1.5 pt-1">
                <div className="skeleton h-3 w-28 rounded-full" />
                <div className="skeleton h-3 w-4/5 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {comentarios.map((c) => (
        <CommentItem key={c.id} comentario={c} pubId={pubId} />
      ))}

      {hayMas && !loading && (
        <button
          onClick={() => cargarMas(pubId)}
          className="text-xs font-semibold py-1 text-center"
          style={{ color: 'var(--color-accent-1)' }}
        >
          Ver más comentarios
        </button>
      )}

      {!loading && !hayMas && comentarios.length === 0 && (
        <p className="text-xs text-center py-2" style={{ color: 'var(--color-muted)' }}>
          Sé el primero en comentar
        </p>
      )}
    </div>
  )
}
