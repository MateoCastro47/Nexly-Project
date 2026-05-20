import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useComunidadesStore } from '../../store/comunidadesStore'
import { uploadImagen } from '../../api/media'

export default function CrearComunidadModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const crear = useComunidadesStore((s) => s.crear)

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [reglas, setReglas] = useState('')
  const [esPublica, setEsPublica] = useState(true)
  const [foto, setFoto] = useState<string>('')
  const [subiendo, setSubiendo] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const handleArchivo = async (file: File) => {
    setSubiendo(true); setError('')
    try {
      const url = await uploadImagen(file, 'comunidades')
      setFoto(url)
    } catch { setError('No se pudo subir la imagen') }
    finally { setSubiendo(false) }
  }

  const handleSubmit = async () => {
    if (nombre.trim().length < 3) { setError('El nombre debe tener al menos 3 caracteres'); return }
    setEnviando(true); setError('')
    try {
      const nueva = await crear({
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        reglas: reglas.trim() || undefined,
        foto: foto || undefined,
        esPublica,
      })
      onClose()
      navigate(`/comunidades/${nueva.id}`)
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      setError(err?.response?.data?.message ?? 'No se pudo crear la comunidad')
    } finally { setEnviando(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 0.5)' }} onClick={onClose}>
      <form
        onSubmit={(e) => { e.preventDefault(); handleSubmit() }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Crear comunidad</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ color: 'var(--color-muted)' }}>✕</button>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0" style={{ background: 'var(--color-surface-2)', border: '1px dashed var(--color-border)' }}>
            {foto ? (
              <img src={foto} className="w-full h-full object-cover" alt="" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl" style={{ color: 'var(--color-muted)' }}>+</div>
            )}
          </div>
          <label className="text-sm font-semibold cursor-pointer px-3 py-2 rounded-xl" style={{ color: 'var(--color-accent-1)', background: 'var(--color-accent-1-tint)' }}>
            {subiendo ? 'Subiendo…' : foto ? 'Cambiar foto' : 'Subir foto'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleArchivo(f) }} />
          </label>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold" style={{ color: 'var(--color-muted)' }}>Nombre</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={100} required
            className="px-3 py-2 rounded-xl text-sm outline-none"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            placeholder="Mi comunidad" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold" style={{ color: 'var(--color-muted)' }}>Descripción</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3}
            className="px-3 py-2 rounded-xl text-sm outline-none resize-none"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            placeholder="¿De qué trata?" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold" style={{ color: 'var(--color-muted)' }}>Reglas (opcional)</label>
          <textarea value={reglas} onChange={(e) => setReglas(e.target.value)} rows={3}
            className="px-3 py-2 rounded-xl text-sm outline-none resize-none"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            placeholder="1. Respeto&#10;2. Sin spam" />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={esPublica} onChange={(e) => setEsPublica(e.target.checked)} className="w-4 h-4" />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Comunidad pública</p>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Cualquiera puede ver y unirse. Si la desmarcas, requerirá aprobación.</p>
          </div>
        </label>

        {error && (
          <p className="text-xs px-3 py-2 rounded-xl" style={{ color: 'var(--color-error)', background: 'oklch(0.62 0.24 28 / 0.06)' }}>{error}</p>
        )}

        <div className="flex gap-2 justify-end mt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-full"
            style={{ color: 'var(--color-muted)', border: '1.5px solid var(--color-border)' }}>Cancelar</button>
          <button type="submit" disabled={enviando || subiendo}
            className="px-5 py-2 text-sm font-semibold rounded-full text-white disabled:opacity-50"
            style={{ background: 'var(--gradient-brand)' }}>{enviando ? 'Creando…' : 'Crear'}</button>
        </div>
      </form>
    </div>
  )
}
