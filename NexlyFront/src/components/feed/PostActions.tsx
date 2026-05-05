import { useRef, useState } from "react";
import { useFeedStore } from "../../store/feedStore";
import type { TipoReaccion } from "../../types";

const REACCIONES: { tipo: TipoReaccion; emoji: string; label: string; color: string }[] = [
  { tipo: 'ME_GUSTA',    emoji: '👍', label: 'Me gusta',    color: '#0a66c2' },
  { tipo: 'ME_ENCANTA',  emoji: '❤️',  label: 'Me encanta',  color: '#df704d' },
  { tipo: 'DIVERTIDO',   emoji: '😂', label: 'Divertido',   color: '#f5c518' },
  { tipo: 'SORPRENDIDO', emoji: '🤩', label: 'Sorprendido', color: '#f5a623' },
  { tipo: 'TRISTE',      emoji: '😢', label: 'Triste',      color: '#70b5f9' },
  { tipo: 'ENOJADO',     emoji: '😡', label: 'Enojado',     color: '#e05e5e' },
]

const REACTION_META: Record<TipoReaccion, { emoji: string; label: string; color: string }> = {
  ME_GUSTA:    { emoji: '👍', label: 'Me gusta',    color: '#0a66c2' },
  ME_ENCANTA:  { emoji: '❤️',  label: 'Me encanta',  color: '#df704d' },
  DIVERTIDO:   { emoji: '😂', label: 'Divertido',   color: '#f5c518' },
  SORPRENDIDO: { emoji: '🤩', label: 'Sorprendido', color: '#f5a623' },
  TRISTE:      { emoji: '😢', label: 'Triste',      color: '#70b5f9' },
  ENOJADO:     { emoji: '😡', label: 'Enojado',     color: '#e05e5e' },
}

interface Props {
  publicacionId: number
  miReaccion?: TipoReaccion
}

export default function PostActions({ publicacionId, miReaccion }: Props) {
  const toggleReaccion = useFeedStore((s) => s.toggleReaccion)
  const [pickerVisible, setPickerVisible] = useState(false)
  const [hoveredReaccion, setHoveredReaccion] = useState<TipoReaccion | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showPicker = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setPickerVisible(true)
  }
  const hidePicker = () => {
    hideTimer.current = setTimeout(() => setPickerVisible(false), 300)
  }

  const handleReaccion = (tipo: TipoReaccion) => {
    toggleReaccion(publicacionId, tipo)
    setPickerVisible(false)
  }

  const meta = miReaccion ? REACTION_META[miReaccion] : null

  return (
    <div className="flex gap-1 w-full">
      {/* Botón principal + picker */}
      <div className="relative" onMouseEnter={showPicker} onMouseLeave={hidePicker}>

        {/* Picker — hereda los handlers del padre Y tiene los suyos propios */}
        {pickerVisible && (
          <div
            onMouseEnter={showPicker}
            onMouseLeave={hidePicker}
            className="absolute bottom-full left-0 mb-2 flex items-end gap-1 px-3 py-2 rounded-full z-10"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
            }}
          >
            {REACCIONES.map(({ tipo, emoji, label, color }) => {
              const isHovered = hoveredReaccion === tipo
              return (
                <div key={tipo} className="relative flex flex-col items-center">
                  {isHovered && (
                    <div
                      className="absolute -top-8 px-2 py-0.5 rounded-full text-xs font-semibold text-white whitespace-nowrap"
                      style={{ background: 'rgba(0,0,0,0.72)' }}
                    >
                      {label}
                    </div>
                  )}
                  <button
                    onClick={() => handleReaccion(tipo)}
                    onMouseEnter={() => setHoveredReaccion(tipo)}
                    onMouseLeave={() => setHoveredReaccion(null)}
                    className="text-3xl leading-none transition-all duration-150 p-0.5"
                    style={{
                      transform: isHovered ? 'scale(1.45) translateY(-5px)' : 'scale(1)',
                      filter: miReaccion === tipo ? `drop-shadow(0 0 5px ${color})` : 'none',
                    }}
                  >
                    {emoji}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Botón principal */}
        <button
          onClick={() => handleReaccion(miReaccion ?? 'ME_GUSTA')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
          style={{ color: meta ? meta.color : 'var(--color-muted)' }}
        >
          {meta ? (
            <span className="text-base leading-none">{meta.emoji}</span>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
          )}
          <span>{meta ? meta.label : 'Recomendar'}</span>
        </button>
      </div>

      {/* Comentar */}
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
        style={{ color: 'var(--color-muted)' }}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Comentar
      </button>
    </div>
  )
}
