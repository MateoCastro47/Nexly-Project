import { useState } from 'react'

const CATEGORIES: Record<string, string[]> = {
  '😀': ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😚','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😔','😪','😴','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','🤯','🥳','😎','🤓','🧐','😕','😟','🙁','☹️','😮','😲','😳','🥺','😦','😧','😨','😰','😥','😢','😭','😱','😤','😡','😠','🤬','😈','👿','💀','☠️','💩','🤡','👻','👾','🤖'],
  '👋': ['👋','🤚','🖐️','✋','🖖','👌','✌️','🤞','🤙','👈','👉','👆','👇','👍','👎','✊','👊','👏','🙌','🙏','💪','🤳','💅','🫵','🫶','🤝','✍️','👀','👅','👄','💋','🫀','🧠'],
  '🐶': ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐔','🐧','🐦','🦆','🦅','🦉','🦇','🐺','🐴','🦄','🐝','🦋','🐢','🐍','🦎','🐙','🦑','🦀','🐠','🐟','🐬','🐳','🦈','🐊','🐘','🦒','🦓','🦍','🐕','🐈','🐇','🦔'],
  '🍕': ['🍎','🍊','🍋','🍌','🍉','🍇','🍓','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🥑','🥦','🌽','🥕','🍆','🥔','🍞','🥐','🧀','🥚','🍳','🥞','🥓','🍔','🍟','🍕','🌭','🌮','🌯','🥗','🍝','🍜','🍲','🍣','🍱','🥟','🍦','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','☕','🍵','🍺','🥂','🍷','🍸','🍹','🧃','🥤'],
  '⚽': ['⚽','🏀','🏈','⚾','🎾','🏐','🏉','🎱','🏓','🏸','🥊','🥋','⛸️','🎿','🏆','🥇','🏅','🎮','🎲','🎭','🎨','🎬','🎤','🎧','🎵','🎶','🎸','🎹','🎺','🥁','🎻','🎉','🎊','🎁','🎈'],
  '❤️': ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','🌟','⭐','🌙','☀️','🌈','⚡','🔥','💧','🌊','✨','🎀','🌹','💐','🌸','🌺','🌻','🌼','🍀','🌿','🍁','🍃','🌍','🕊️','🔑','💎','🏠','📱','💻','📷','🎵','🎨','✈️','🚀','⏰','💫','🫧'],
}

const LABELS: Record<string, string> = {
  '😀': 'Caras',
  '👋': 'Gestos',
  '🐶': 'Animales',
  '🍕': 'Comida',
  '⚽': 'Actividades',
  '❤️': 'Objetos',
}

interface Props {
  onSelect: (emoji: string) => void
  onClose: () => void
}

export default function EmojiPicker({ onSelect, onClose }: Props) {
  const [tab, setTab] = useState('😀')
  const [search, setSearch] = useState('')

  const all = Object.values(CATEGORIES).flat()
  const visible = search
    ? all.filter((e) => e.includes(search))
    : CATEGORIES[tab]

  return (
    <div
      className="absolute top-full left-0 mt-2 w-[320px] rounded-3xl overflow-hidden z-50"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid color-mix(in oklch, var(--color-border), var(--color-brand) 12%)',
        boxShadow: 'var(--shadow-card-hover)',
        animation: 'scaleIn 0.2s cubic-bezier(0.19, 1, 0.22, 1)',
        transformOrigin: 'top left'
      }}
    >
      {/* Búsqueda */}
      <div className="p-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none" style={{ color: 'var(--color-muted)' }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            autoFocus
            type="text"
            placeholder="Buscar emoji…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full pl-9 pr-3 py-2 text-sm rounded-full"
            style={{ 
              background: 'var(--color-bg)',
              border: 'none',
              boxShadow: 'inset 0 1px 3px oklch(0 0 0 / 0.05)'
            }}
          />
        </div>
      </div>

      {/* Tabs de categorías */}
      {!search && (
        <div
          className="flex border-b px-1 py-1"
          style={{ borderColor: 'var(--color-border)' }}
        >
          {Object.keys(CATEGORIES).map((cat) => (
            <button
              key={cat}
              title={LABELS[cat]}
              onClick={() => setTab(cat)}
              className="flex-1 py-2 text-base transition-all rounded-xl mx-0.5"
              style={{
                background: tab === cat ? 'var(--color-brand-tint)' : 'transparent',
                color: tab === cat ? 'var(--color-brand)' : 'inherit',
                transform: tab === cat ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid de emojis */}
      <div className="grid grid-cols-7 gap-1 p-3 max-h-60 overflow-y-auto">
        {visible.length > 0 ? visible.map((emoji, i) => (
          <button
            key={i}
            onClick={() => { onSelect(emoji) }}
            className="text-2xl p-2 rounded-2xl leading-none transition-all aspect-square flex items-center justify-center"
            style={{ background: 'transparent' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'var(--color-brand-tint)';
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.15) translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.transform = 'scale(1) translateY(0)';
            }}
          >
            {emoji}
          </button>
        )) : (
          <p className="col-span-8 text-center text-xs py-4" style={{ color: 'var(--color-muted)' }}>
            Sin resultados
          </p>
        )}
      </div>
    </div>
  )
}
