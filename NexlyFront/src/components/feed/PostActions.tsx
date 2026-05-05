import { useRef, useState } from "react";
import { useFeedStore } from "../../store/feedStore";
import type { TipoReaccion } from "../../types";

const REACCIONES: { tipo: TipoReaccion; emoji: string; label: string; color: string }[] = [
  { tipo: 'ME_GUSTA',    emoji: '👍', label: 'Me gusta',    color: '#6c5ce7' },
  { tipo: 'ME_ENCANTA',  emoji: '❤️',  label: 'Me encanta',  color: '#e17055' },
  { tipo: 'DIVERTIDO',   emoji: '😂', label: 'Divertido',   color: '#fdcb6e' },
  { tipo: 'SORPRENDIDO', emoji: '🤩', label: 'Sorprendido', color: '#f0932b' },
  { tipo: 'TRISTE',      emoji: '😢', label: 'Triste',      color: '#74b9ff' },
  { tipo: 'ENOJADO',     emoji: '😡', label: 'Enojado',     color: '#d63031' },
]

const REACTION_META: Record<TipoReaccion, { emoji: string; label: string; color: string }> = {
  ME_GUSTA:    { emoji: '👍', label: 'Me gusta',    color: '#6c5ce7' },
  ME_ENCANTA:  { emoji: '❤️',  label: 'Me encanta',  color: '#e17055' },
  DIVERTIDO:   { emoji: '😂', label: 'Divertido',   color: '#fdcb6e' },
  SORPRENDIDO: { emoji: '🤩', label: 'Sorprendido', color: '#f0932b' },
  TRISTE:      { emoji: '😢', label: 'Triste',      color: '#74b9ff' },
  ENOJADO:     { emoji: '😡', label: 'Enojado',     color: '#d63031' },
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
    <div className="flex gap-2 w-full">
      {/* Botón principal + picker */}
      <div className="relative flex-1" onMouseEnter={showPicker} onMouseLeave={hidePicker}>

        {/* Picker flotante con glassmorphism */}
        {pickerVisible && (
          <div
            onMouseEnter={showPicker}
            onMouseLeave={hidePicker}
            className="absolute bottom-full left-0 mb-3 flex items-end gap-1.5 px-4 py-3 rounded-full z-10"
            style={{
              background: 'oklch(0.99 0.004 65 / 0.92)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid var(--color-border)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
              animation: 'scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {REACCIONES.map(({ tipo, emoji, label, color }) => {
              const isHovered = hoveredReaccion === tipo
              return (
                <div key={tipo} className="relative flex flex-col items-center">
                  {isHovered && (
                    <div className="tooltip-popup absolute -top-9 whitespace-nowrap">
                      {label}
                    </div>
                  )}
                  <button
                    onClick={() => handleReaccion(tipo)}
                    onMouseEnter={() => setHoveredReaccion(tipo)}
                    onMouseLeave={() => setHoveredReaccion(null)}
                    className="text-[1.75rem] leading-none p-1 rounded-full"
                    style={{
                      transform: isHovered ? 'scale(1.5) translateY(-6px)' : 'scale(1)',
                      transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      filter: miReaccion === tipo ? `drop-shadow(0 0 8px ${color})` : 'none',
                      background: isHovered ? 'oklch(0.95 0.01 65)' : 'transparent',
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
          className={`action-btn flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold ${
            meta ? 'action-btn-active' : ''
          }`}
          style={meta ? { color: meta.color, borderColor: `${meta.color}30` } : undefined}
        >
          {meta ? (
            <span className="text-lg leading-none">{meta.emoji}</span>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
          )}
          <span>{meta ? meta.label : 'Recomendar'}</span>
        </button>
      </div>

      {/* Comentar */}
      <button
        className="action-btn flex items-center justify-center gap-2 flex-1 px-4 py-2.5 text-sm font-semibold"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Comentar
      </button>

      {/* Compartir */}
      <button
        className="action-btn flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      </button>
    </div>
  )
}
