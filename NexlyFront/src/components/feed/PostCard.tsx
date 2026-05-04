import type { Publicacion } from '../../types'
import { useFeedStore } from '../../store/feedStore'
import PostHeader from './PostHeader'

interface Props {
  publicacion: Publicacion
}

function ImagenGrid({ imagenes }: { imagenes: string[] }) {
  if (imagenes.length === 0) return null

  if (imagenes.length === 1) return (
    <img src={imagenes[0]} alt="" className="w-full max-h-96 object-cover rounded-xl" />
  )

  if (imagenes.length === 2) return (
    <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
      {imagenes.map((src) => (
        <img key={src} src={src} alt="" className="w-full h-56 object-cover" />
      ))}
    </div>
  )

  // 3 o más: primera ocupa toda la izquierda, las demás apiladas a la derecha
  return (
    <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
      <img src={imagenes[0]} alt="" className="h-full object-cover row-span-2" />
      {imagenes.slice(1, 3).map((src) => (
        <img key={src} src={src} alt="" className="w-full h-36 object-cover" />
      ))}
    </div>
  )
}

export default function PostCard({ publicacion }: Props) {
  const eliminar = useFeedStore((s) => s.eliminar)

  return (
    <article
      className="rounded-2xl p-5 flex flex-col gap-4 shadow-sm"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <PostHeader
        autor={publicacion.autor}
        fechaCreacion={publicacion.fechaCreacion}
        comunidadNombre={publicacion.comunidadNombre}
        onEliminar={() => eliminar(publicacion.id)}
      />

      {/* Contenido */}
      {publicacion.contenido && (
        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text)' }}>
          {publicacion.contenido}
        </p>
      )}

      {/* Imágenes */}
      <ImagenGrid imagenes={publicacion.imagenes} />

      {/* Separador + stats */}
      {(publicacion.totalReacciones > 0 || publicacion.totalComentarios > 0) && (
        <div
          className="flex items-center gap-4 text-xs pt-1 border-t"
          style={{ color: 'var(--color-muted)', borderColor: 'var(--color-border)' }}
        >
          {publicacion.totalReacciones > 0 && (
            <span>{publicacion.totalReacciones} reacciones</span>
          )}
          {publicacion.totalComentarios > 0 && (
            <span>{publicacion.totalComentarios} comentarios</span>
          )}
        </div>
      )}

      {/* PostActions — se añade en paso 6 */}
      <div
        className="flex gap-1 pt-1 border-t"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {/* placeholder */}
      </div>
    </article>
  )
}
