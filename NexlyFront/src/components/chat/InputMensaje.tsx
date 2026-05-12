import { useState } from 'react'
import { useChatStore } from '../../store/chatStore'

interface Props {
  conversacionId: number
}

export default function InputMensaje({ conversacionId }: Props) {
  const [texto, setTexto] = useState('')
  const enviar = useChatStore((s) => s.enviar)
  const enviando = useChatStore((s) => s.enviando)

  const handleEnviar = async () => {
    const contenido = texto.trim()
    if (!contenido || enviando) return
    setTexto('')
    await enviar(conversacionId, contenido)
  }

  return (
    <div className="px-4 py-3 flex gap-2 items-end" style={{ borderTop: '1px solid var(--color-border)' }}>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleEnviar()
          }
        }}
        placeholder="Escribe un mensaje... (Enter para enviar)"
        rows={1}
        className="flex-1 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none max-h-32"
        style={{ background: 'var(--color-bg)', border: '1.5px solid var(--color-border)', color: 'var(--color-text)' }}
      />
      <button
        onClick={handleEnviar}
        disabled={!texto.trim() || enviando}
        className="p-2 rounded-xl text-white transition-colors shrink-0 disabled:opacity-40"
        style={{ background: 'var(--color-accent-1)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  )
}
