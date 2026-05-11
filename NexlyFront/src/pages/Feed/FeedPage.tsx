import { useEffect, useRef } from "react";
import { useFeedStore } from "../../store/feedStore";
import CreatePost from "../../components/feed/CreatePost";
import PostCard from "../../components/feed/PostCard";

function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-3xl p-5 flex flex-col gap-4"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            animationDelay: `${i * 0.1}s`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="skeleton w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="skeleton h-3.5 w-32 rounded-full" />
              <div className="skeleton h-3 w-20 rounded-full" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="skeleton h-3 w-full rounded-full" />
            <div className="skeleton h-3 w-4/5 rounded-full" />
            <div className="skeleton h-3 w-3/5 rounded-full" />
          </div>
          {i === 0 && <div className="skeleton h-48 w-full rounded-2xl" />}
          <div className="flex gap-2 pt-2">
            <div className="skeleton h-10 flex-1 rounded-xl" />
            <div className="skeleton h-10 flex-1 rounded-xl" />
            <div className="skeleton h-10 w-14 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function FeedPage() {
  const { publicaciones, loading, error, hayMas, postCitado, cargarFeed, cargarMas } = useFeedStore()
  const sentinelRef = useRef<HTMLDivElement>(null)
  const createPostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    cargarFeed()
  }, [cargarFeed])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if(!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => {if (entry.isIntersecting) cargarMas() },
      { threshold: 0.1 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [cargarMas])

  useEffect(() => {
    if (postCitado) {
      createPostRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [postCitado])

  return(
    <div className="flex flex-col gap-5">
      <div ref={createPostRef}>
        <CreatePost />
      </div>

      {error && (
        <div
          className="text-sm text-center py-6 px-4 rounded-2xl"
          style={{
            color: 'var(--color-error)',
            background: 'oklch(0.62 0.24 28 / 0.06)',
            border: '1px solid oklch(0.62 0.24 28 / 0.15)',
          }}
        >
          {error}
        </div>
      )}

      {publicaciones.map((p, index) => (
        <PostCard
          key={p.id}
          publicacion={p}
          variant={index % 7 === 0 ? 'hero' : 'normal'}
        />
      ))}

      {loading && <FeedSkeleton />}

      {hayMas && <div ref={sentinelRef} className="h-4"/>}

      {!hayMas && publicaciones.length > 0 && (
        <div className="flex flex-col items-center py-10 gap-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
            style={{ background: 'var(--color-accent-1-tint)' }}
          >
            🎉
          </div>
          <p
            className="text-sm font-medium"
            style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-display)' }}
          >
            Has llegado al final del feed
          </p>
          <p className="text-xs" style={{ color: 'oklch(0.65 0.01 50)' }}>
            ¡Sigue explorando comunidades para más contenido!
          </p>
        </div>
      )}
    </div>
  )
}
