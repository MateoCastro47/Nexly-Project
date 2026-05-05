import type { Publicacion } from '../../types'
import { useFeedStore } from '../../store/feedStore'
import PostHeader from './PostHeader'
import PostActions from './PostActions'

interface Props {
  publicacion: Publicacion
  variant?: 'normal' | 'hero'
}

function ImagenGrid({ imagenes, isHero }: { imagenes: string[]; isHero?: boolean }) {
  if (imagenes.length === 0) return null

  const maxH = isHero ? 'max-h-[28rem]' : 'max-h-96'

  if (imagenes.length === 1) return (
    <div className="overflow-hidden rounded-2xl group">
      <img
        src={imagenes[0]}
        alt=""
        className={`w-full ${maxH} object-cover transition-transform duration-500 group-hover:scale-[1.02]`}
      />
    </div>
  )

  if (imagenes.length === 2) return (
    <div className="grid grid-cols-2 gap-1.5 rounded-2xl overflow-hidden">
      {imagenes.map((src) => (
        <div key={src} className="overflow-hidden group">
          <img
            src={src}
            alt=""
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ))}
    </div>
  )

  // 3 o más: primera ocupa toda la izquierda, las demás apiladas a la derecha
  return (
    <div className="grid grid-cols-2 gap-1.5 rounded-2xl overflow-hidden">
      <div className="overflow-hidden group row-span-2">
        <img
          src={imagenes[0]}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      {imagenes.slice(1, 3).map((src) => (
        <div key={src} className="overflow-hidden group">
          <img
            src={src}
            alt=""
            className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ))}
    </div>
  )
}

export default function PostCard({ publicacion, variant = 'normal' }: Props) {
  const eliminar = useFeedStore((s) => s.eliminar)
  const isHero = variant === 'hero'

  return (
    <article
      className={`card card-feed flex flex-col gap-4 ${isHero ? 'card-hero p-6' : 'p-5'}`}
      style={isHero ? { animationDelay: '0.1s' } : undefined}
    >
      <PostHeader
        autor={publicacion.autor}
        fechaCreacion={publicacion.fechaCreacion}
        comunidadNombre={publicacion.comunidadNombre}
        onEliminar={() => eliminar(publicacion.id)}
        isHero={isHero}
      />

      {/* Contenido */}
      {publicacion.contenido && (
        <p
          className={`leading-relaxed whitespace-pre-wrap ${
            isHero ? 'text-base' : 'text-sm'
          }`}
          style={{ color: 'var(--color-text)' }}
        >
          {publicacion.contenido}
        </p>
      )}

      {/* Imágenes */}
      <ImagenGrid imagenes={publicacion.imagenes} isHero={isHero} />

      {/* Separador decorativo + stats */}
      {(publicacion.totalReacciones > 0 || publicacion.totalComentarios > 0) && (
        <>
          <div className="divider-brand" />
          <div
            className="flex items-center gap-4 text-xs"
            style={{ color: 'var(--color-muted)' }}
          >
            {publicacion.totalReacciones > 0 && (
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--color-accent-1)' }}
                />
                {publicacion.totalReacciones} reacciones
              </span>
            )}
            {publicacion.totalComentarios > 0 && (
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--color-accent-2)' }}
                />
                {publicacion.totalComentarios} comentarios
              </span>
            )}
          </div>
        </>
      )}

      {/* PostActions */}
      <div className="pt-1">
        <div className="divider-brand mb-3" />
        <PostActions
            publicacionId={publicacion.id}
            miReaccion={publicacion.miReaccion}
        />
      </div>
    </article>
  )
}
