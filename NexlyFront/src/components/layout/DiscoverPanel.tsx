export default function DiscoverPanel() {
  return (
    <aside className="hidden xl:flex flex-col w-80 shrink-0 px-5 py-6 gap-6 h-screen sticky top-0 overflow-y-auto">

      {/* ── Buscar ── */}
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ color: 'var(--color-muted)' }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Buscar en Nexly"
          className="input w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl"
        />
      </div>

      {/* ── Tendencias (vacío, pendiente de API) ── */}
      <div
        className="rounded-3xl p-5 flex flex-col gap-3"
        style={{
          background: 'linear-gradient(165deg, var(--color-surface), var(--color-surface-2))',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h3
          className="text-sm font-bold flex items-center gap-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          <span className="text-base">🔥</span>
          Tendencias
        </h3>
        <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
          Las tendencias aparecerán aquí.
        </p>
      </div>

      {/* ── Sugerencias (vacío, pendiente de API) ── */}
      <div
        className="rounded-3xl p-5 flex flex-col gap-3"
        style={{
          background: 'linear-gradient(165deg, var(--color-surface), var(--color-surface-2))',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h3
          className="text-sm font-bold flex items-center gap-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          <span className="text-base">✨</span>
          Quién seguir
        </h3>
        <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
          Las sugerencias aparecerán aquí.
        </p>
      </div>

      {/* ── Footer legal ── */}
      <div className="mt-auto pt-4">
        <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          <a href="#" className="hover:underline">Términos</a> · <a href="#" className="hover:underline">Privacidad</a> · <a href="#" className="hover:underline">Cookies</a>
        </p>
        <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.01 50)' }}>
          © 2026 Nexly
        </p>
      </div>
    </aside>
  )
}
