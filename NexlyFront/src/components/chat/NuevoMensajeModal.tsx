import { useState } from 'react'
import { buscarUsuarios } from '../../api/busqueda'
import { useChatStore } from '../../store/chatStore'
import type { Usuario } from '../../types'

interface Props {
  onClose: () => void
}

export default function NuevoMensajeModal({ onClose }: Props) {
  const [q, setQ] = useState('')
  const [resultados, setResultados] = useState<Usuario[]>([])
  const [buscando, setBuscando] = useState(false)
  const iniciarDirecta = useChatStore((s) => s.iniciarDirecta)
  const seleccionar = useChatStore((s) => s.seleccionar)

  const handleBuscar = async (texto: string) => {
    setQ(texto)
    if (texto.trim().length < 2) {
      setResultados([])
      return
    }
    setBuscando(true)
    try {
      const { data } = await buscarUsuarios(texto.trim())
      setResultados(data)
    } finally {
      setBuscando(false)
    }
  }

  const handleElegir = async (u: Usuario) => {
    const convId = await iniciarDirecta(u.id)
    await seleccionar(convId)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-300 flex items-start justify-center pt-24"
      style={{ background: 'var(--color-overlay)' }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl w-full max-w-md overflow-hidden"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h3 className="font-semibold">Nuevo mensaje</h3>
          <button onClick={onClose} className="text-lg leading-none" style={{ color: 'var(--color-muted)' }}>
            &times;
          </button>
        </div>
        <input
          autoFocus
          value={q}
          onChange={(e) => handleBuscar(e.target.value)}
          placeholder="Buscar usuario..."
          className="w-full bg-transparent px-4 py-3 text-sm focus:outline-none"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        />
        <div className="max-h-72 overflow-y-auto">
          {buscando && (
            <p className="text-center text-xs py-4" style={{ color: 'var(--color-muted)' }}>Buscando...</p>
          )}
          {!buscando && q.trim().length >= 2 && resultados.length === 0 && (
            <p className="text-center text-xs py-4" style={{ color: 'var(--color-muted)' }}>Sin resultados</p>
          )}
          {resultados.map((u) => (
            <button
              key={u.id}
              onClick={() => handleElegir(u)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-(--color-surface-2)"
            >
              {u.fotoPerfil ? (
                <img src={u.fotoPerfil} alt={u.nombreCompleto} className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'var(--gradient-brand)' }}>
                  {u.nombreCompleto[0]?.toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{u.nombreCompleto}</p>
                <p className="text-xs truncate" style={{ color: 'var(--color-muted)' }}>@{u.nombreUsuario}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
