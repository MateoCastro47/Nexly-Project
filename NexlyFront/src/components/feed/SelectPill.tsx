import { useEffect, useRef, useState } from 'react'

export interface SelectOption {
  value: string
  label: string
  icon?: string
  color: string
  bg: string
}

interface Props {
  value: string
  onChange: (v: string) => void
  options: SelectOption[]
  neutralValue?: string
}

export default function SelectPill({ value, onChange, options, neutralValue }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected  = options.find((o) => o.value === value) ?? options[0]
  const isNeutral = neutralValue != null && value === neutralValue

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      {/* Pill trigger */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all select-none"
        style={{
          color:      isNeutral ? 'var(--color-muted)' : selected.color,
          background: isNeutral ? 'oklch(0.50 0 0 / 0.07)' : selected.bg,
        }}
      >
        {selected.icon && <span className="leading-none">{selected.icon}</span>}
        <span>{selected.label}</span>
        <svg
          className="w-3 h-3 opacity-50 shrink-0"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute top-full mt-2 left-0 z-30 py-1.5 rounded-2xl"
          style={{
            minWidth: '152px',
            background: 'oklch(0.99 0.004 65 / 0.96)',
            backdropFilter: 'blur(14px)',
            border: '1.5px solid var(--color-border)',
            boxShadow: '0 8px 32px oklch(0 0 0 / 0.13), 0 2px 8px oklch(0 0 0 / 0.07)',
            animation: 'scaleIn 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {options.map((opt) => {
            const isActive = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(opt.value); setOpen(false) }}
                className="flex items-center gap-2.5 text-xs font-semibold text-left transition-colors rounded-xl"
                style={{
                  width: 'calc(100% - 8px)',
                  margin: '1px 4px',
                  padding: '7px 12px',
                  color:      isActive ? opt.color : 'var(--color-text)',
                  background: isActive ? opt.bg    : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'oklch(0.93 0.005 65)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                {opt.icon && <span className="text-sm leading-none w-4 text-center">{opt.icon}</span>}
                <span className="flex-1">{opt.label}</span>
                {isActive && (
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
