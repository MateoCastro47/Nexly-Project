import { useFeedStore } from "../../store/feedStore";
import type { TipoReaccion } from "../../types";

interface Props {
  publicacionId: number
  miReaccion?: TipoReaccion
  onCitar?: () => void
  onComentar?: () => void
  onToggleReaccion?: (id: number, tipo: TipoReaccion) => void
}

export default function PostActions({ publicacionId, miReaccion, onCitar, onComentar, onToggleReaccion }: Props) {
  const toggleReaccionStore = useFeedStore((s) => s.toggleReaccion)
  const toggleReaccion = onToggleReaccion ?? toggleReaccionStore
  const liked = !!miReaccion

  return (
    <div className="flex gap-2 w-full">

      {/* Me gusta */}
      <button
        onClick={() => toggleReaccion(publicacionId, 'ME_GUSTA')}
        className={`action-btn flex items-center justify-center gap-2 flex-1 px-4 py-2.5 text-sm font-semibold ${liked ? 'action-btn-active' : ''}`}
        style={liked ? { color: '#e17055', borderColor: '#e1705530' } : undefined}
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill={liked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: liked ? 'scale(1.15)' : 'scale(1)',
            transition: 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1), fill 0.15s',
          }}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span>{liked ? 'Me gusta' : 'Me gusta'}</span>
      </button>

      {/* Comentar */}
      <button
        onClick={onComentar}
        className="action-btn flex items-center justify-center gap-2 flex-1 px-4 py-2.5 text-sm font-semibold"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Comentar
      </button>

      {/* Citar */}
      <button
        onClick={onCitar}
        className="action-btn flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold"
        title="Citar publicación"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 1l4 4-4 4" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <path d="M7 23l-4-4 4-4" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      </button>

    </div>
  )
}
