import type { Comunidad } from '../../types'

interface Props {
  comunidad: Comunidad
  onToggleMembresia: () => void
}

export default function ComunidadHeader({ comunidad, onToggleMembresia }: Props) {
  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(165deg, var(--color-surface), var(--color-surface-2))',
        border: '1px solid color-mix(in oklch, var(--color-border), var(--color-accent-1) 8%)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="h-32" style={{ background: 'var(--gradient-brand-vivid)', backgroundSize: '300% 300%', animation: 'gradientShift 6s ease infinite' }} />
      <div className="px-5 pb-5">
        <div className="flex items-end justify-between -mt-10 mb-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0" style={{ background: 'var(--color-surface)', border: '4px solid var(--color-surface)' }}>
            {comunidad.foto ? (
              <img src={comunidad.foto} className="w-full h-full object-cover" alt="" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold" style={{ background: 'var(--gradient-brand)' }}>
                {comunidad.nombre[0].toUpperCase()}
              </div>
            )}
          </div>

          <button
            onClick={onToggleMembresia}
            disabled={comunidad.esCreador}
            className="px-5 py-2 text-sm font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={
              comunidad.esMiembro
                ? { color: 'var(--color-muted)', border: '1.5px solid var(--color-border)', background: 'transparent' }
                : { color: 'white', background: 'var(--gradient-brand)', border: '1.5px solid transparent' }
            }
          >
            {comunidad.esCreador ? 'Creador' : comunidad.esMiembro ? 'Salir' : 'Unirse'}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold leading-tight" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
              {comunidad.nombre}
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{
              background: comunidad.esPublica ? 'var(--color-accent-1-tint)' : 'var(--color-surface-3)',
              color: comunidad.esPublica ? 'var(--color-accent-1)' : 'var(--color-muted)',
            }}>
              {comunidad.esPublica ? 'PÚBLICA' : 'PRIVADA'}
            </span>
            {comunidad.categoria && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--color-surface-3)', color: 'var(--color-muted)' }}>
                {comunidad.categoria}
              </span>
            )}
          </div>

          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>{comunidad.totalMiembros} miembros</p>

          {comunidad.descripcion && (
            <p className="text-sm leading-relaxed mt-1" style={{ color: 'var(--color-text)' }}>{comunidad.descripcion}</p>
          )}

          {comunidad.reglas && (
            <details className="mt-2">
              <summary className="text-xs font-semibold cursor-pointer" style={{ color: 'var(--color-accent-1)' }}>
                Reglas de la comunidad
              </summary>
              <p className="text-xs leading-relaxed mt-2 whitespace-pre-wrap" style={{ color: 'var(--color-muted)' }}>{comunidad.reglas}</p>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}
