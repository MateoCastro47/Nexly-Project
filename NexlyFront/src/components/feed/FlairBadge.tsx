import type { TipoPost } from '../../types'

interface Config {
  label: string
  color: string
  bg: string
}

const CONFIG: Record<TipoPost, Config> = {
  NORMAL:   { label: '',         color: '',                           bg: '' },
  PREGUNTA: { label: 'Pregunta', color: 'var(--color-accent-1)',      bg: 'var(--color-accent-1-tint)' },
  NOTICIA:  { label: 'Noticia',  color: 'oklch(0.55 0.18 150)',       bg: 'oklch(0.55 0.18 150 / 0.12)' },
  DEBATE:   { label: 'Debate',   color: 'oklch(0.60 0.20 50)',        bg: 'oklch(0.60 0.20 50 / 0.12)' },
  ANUNCIO:  { label: 'Anuncio',  color: 'oklch(0.55 0.22 300)',       bg: 'oklch(0.55 0.22 300 / 0.12)' },
}

export default function FlairBadge({ tipo }: { tipo: TipoPost }) {
  const { label, color, bg } = CONFIG[tipo]
  if (!label) return null
  return (
    <span
      className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full w-fit"
      style={{ color, background: bg }}
    >
      {label}
    </span>
  )
}
