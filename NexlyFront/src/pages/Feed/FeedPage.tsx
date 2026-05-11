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
        <div className="flex flex-col items-center py-12 gap-4">
          <div className="relative">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: 'var(--gradient-brand-soft)',
                border: '1px solid color-mix(in oklch, var(--color-border), var(--color-accent-1) 18%)',
                boxShadow: '0 4px 16px oklch(0.50 0.22 275 / 0.12)',
              }}
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="url(#end-grad)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="end-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="oklch(0.50 0.22 275)" />
                    <stop offset="100%" stopColor="oklch(0.64 0.16 32)" />
                  </linearGradient>
                </defs>
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M8 12l3 3 5-5" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <p
              className="text-sm font-bold"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}
            >
              Todo al día por ahora
            </p>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
              Explora comunidades para descubrir más contenido
            </p>
          </div>
          <div
            className="h-px w-24"
            style={{ background: 'var(--gradient-brand-soft)' }}
          />
        </div>
      )}
    </div>
  )
}
