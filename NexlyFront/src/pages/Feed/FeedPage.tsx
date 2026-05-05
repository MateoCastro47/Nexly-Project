import { useEffect, useRef } from "react";
import { useFeedStore } from "../../store/feedStore";
import CreatePost from "../../components/feed/CreatePost";
import PostCard from "../../components/feed/PostCard";

export default function FeedPage() {
  const { publicaciones, loading, error, hayMas, cargarFeed, cargarMas } = useFeedStore()
  const sentinelRef = useRef<HTMLDivElement>(null)

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

  return(
    <div className="flex flex-col gap-4">
      <CreatePost />

      {error && (
        <p className="text-sm text-center py-6" style={{ color: 'var(--color-error)' }}>
          {error}
        </p>
      )}

      {publicaciones.map((p) => (
        <PostCard key={p.id} publicacion={p} />
      ))}

      {loading && (
        <div className="flex flex-col gap-4">
          {[0, 1].map((i) => (
            <div
            key={i}
            className="rounded-2xl h-36 animate-pulse"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
            </div>
          ))}
        </div>
      )}

      {hayMas && <div ref={sentinelRef} className="h-4"/>}

      {!hayMas && publicaciones.length > 0 && (
        <p className="text-xs text-center py-6" style={{ color: 'var(--color-muted)' }}>
          Has llegado al final del feed
        </p>
      )}
    </div>
  )
}
