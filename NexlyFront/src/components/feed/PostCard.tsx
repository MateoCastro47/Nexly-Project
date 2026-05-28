import { useState } from 'react'
import type { Publicacion, TipoReaccion } from '../../types'
import { useFeedStore } from '../../store/feedStore'
import PostHeader from './PostHeader'
import PostActions from './PostActions'
import FlairBadge from './FlairBadge'
import QuoteCard from './QuoteCard'
import CommentSection from './CommentSection'

interface Props {
  publicacion: Publicacion
  variant?: 'normal' | 'hero'
  onEliminar?: () => void
  onToggleReaccion?: (id: number, tipo: TipoReaccion) => void
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

export default function PostCard({ publicacion, variant = 'normal', onEliminar, onToggleReaccion }: Props) {
  const eliminarDelFeed = useFeedStore((s) => s.eliminar)
  const setCitando      = useFeedStore((s) => s.setCitando)
  const isHero = variant === 'hero'
  const [showComments, setShowComments] = useState(false)

  return (
    <article
      className={`card card-feed flex flex-col gap-4 ${isHero ? 'card-hero p-4 sm:p-6' : 'p-4 sm:p-5'}`}
      style={isHero ? { animationDelay: '0.1s' } : undefined}
    >
      {publicacion.fijada && (
        <div className="flex items-center gap-1.5 -mb-1 text-xs" style={{ color: 'var(--color-muted)' }}>
          <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6h2v-6h5v-2l-2-2z" />
          </svg>
          <span>Publicación fijada</span>
        </div>
      )}

      <PostHeader
        autor={publicacion.autor}
        fechaCreacion={publicacion.fechaCreacion}
        comunidadNombre={publicacion.comunidadNombre}
        onEliminar={onEliminar ?? (() => eliminarDelFeed(publicacion.id))}
        isHero={isHero}
      />

      <FlairBadge tipo={publicacion.tipoPost} />

      {publicacion.contenido && (
        <p
          className={`leading-relaxed whitespace-pre-wrap ${isHero ? 'text-base' : 'text-[0.9375rem]'}`}
          style={{ color: 'var(--color-text)' }}
        >
          {publicacion.contenido}
        </p>
      )}

      {publicacion.publicacionCitada && (
        <QuoteCard post={publicacion.publicacionCitada} />
      )}

      <ImagenGrid imagenes={publicacion.imagenes} isHero={isHero} />

      {(publicacion.conteoReacciones > 0 || publicacion.conteoComentarios > 0) && (
        <>
          <div className="divider-brand" />
          <div
            className="flex items-center gap-4 text-xs"
            style={{ color: 'var(--color-muted)' }}
          >
            {publicacion.conteoReacciones > 0 && (
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--color-accent-1)' }}
                />
                {publicacion.conteoReacciones} reacciones
              </span>
            )}
            {publicacion.conteoComentarios > 0 && (
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--color-accent-2)' }}
                />
                {publicacion.conteoComentarios} comentarios
              </span>
            )}
          </div>
        </>
      )}

      <div className="pt-1">
        <div className="divider-brand mb-3" />
        <PostActions
          publicacionId={publicacion.id}
          miReaccion={publicacion.reaccionDelVisor}
          onCitar={() => setCitando(publicacion)}
          onComentar={() => setShowComments((v) => !v)}
          onToggleReaccion={onToggleReaccion}
        />
      </div>

      {showComments && (
        <>
          <div className="divider-brand" />
          <CommentSection pubId={publicacion.id} />
        </>
      )}
    </article>
  )
}
