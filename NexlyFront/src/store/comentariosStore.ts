import { create } from "zustand";
import type { Comentario, TipoReaccion } from "../types";
import { crearComentario, eliminarComentario, getComentarios, getRespuestas, quitarReaccionComentario, reaccionarComentario } from "../api/comentarios";
interface RepliesState{
    items: Comentario[]
    pagina: number,
    hayMas: boolean
    loading: boolean
}
interface PostState {
    comentarios: Comentario[]
    pagina: number
    hayMas: boolean
    loading: boolean
    enviando: boolean
    respuestas: Record<number, RepliesState>
}

interface ComentariosStore {
  byPost: Record<number, PostState>
  cargar: (pubId: number) => Promise<void>
  cargarMas: (pubId: number) => Promise<void>
  comentar: (pubId: number, contenido: string) => Promise<void>
  responder: (pubId: number, padreId: number, contenido: string) => Promise<void>
  eliminar: (pubId: number, comentarioId: number, padreId?: number) => Promise<void>
  toggleReaccion: (pubId: number, comentarioId: number, tipo: TipoReaccion, padreId?: number) => Promise<void>
  cargarRespuestas: (pubId: number, comentarioId: number) => Promise<void>
}

const initPost = (): PostState => ({
    comentarios: [], pagina: 0, hayMas: true, loading: false, enviando: false, respuestas: {},
})

const patchComment = (list: Comentario[], id: number, fn: (c: Comentario) => Comentario) => 
    list.map((c) => (c.id === id ? fn(c) : c))

export const useComentariosStore = create<ComentariosStore>((set, get) => ({
  byPost: {},

  cargar: async (pubId) => {
    if (get().byPost[pubId]?.loading) return
    set((s) => ({ byPost: { ...s.byPost, [pubId]: { ...initPost(), loading: true } } }))
    try {
      const { data } = await getComentarios(pubId, 0)
      set((s) => ({
        byPost: {
          ...s.byPost,
          [pubId]: { ...s.byPost[pubId], loading: false, comentarios: data.content, hayMas: !data.last },
        },
      }))
    } catch {
      set((s) => ({ byPost: { ...s.byPost, [pubId]: { ...s.byPost[pubId], loading: false } } }))
    }
  },

  cargarMas: async (pubId) => {
    const state = get().byPost[pubId]
    if (!state || !state.hayMas || state.loading) return
    const sig = state.pagina + 1
    set((s) => ({ byPost: { ...s.byPost, [pubId]: { ...s.byPost[pubId], loading: true } } }))
    try {
      const { data } = await getComentarios(pubId, sig)
      set((s) => ({
        byPost: {
          ...s.byPost,
          [pubId]: {
            ...s.byPost[pubId],
            loading: false,
            comentarios: [...s.byPost[pubId].comentarios, ...data.content],
            hayMas: !data.last,
            pagina: sig,
          },
        },
      }))
    } catch {
      set((s) => ({ byPost: { ...s.byPost, [pubId]: { ...s.byPost[pubId], loading: false } } }))
    }
  },

  comentar: async (pubId, contenido) => {
    set((s) => ({ byPost: { ...s.byPost, [pubId]: { ...(s.byPost[pubId] ?? initPost()), enviando: true } } }))
    try {
      const { data } = await crearComentario(pubId, contenido)
      set((s) => {
        const p = s.byPost[pubId] ?? initPost()
        return { byPost: { ...s.byPost, [pubId]: { ...p, enviando: false, comentarios: [data, ...p.comentarios] } } }
      })
    } catch {
      set((s) => ({ byPost: { ...s.byPost, [pubId]: { ...s.byPost[pubId], enviando: false } } }))
    }
  },

  responder: async (pubId, padreId, contenido) => {
    set((s) => ({ byPost: { ...s.byPost, [pubId]: { ...(s.byPost[pubId] ?? initPost()), enviando: true } } }))
    try {
      const { data } = await crearComentario(pubId, contenido, padreId)
      set((s) => {
        const p = s.byPost[pubId] ?? initPost()
        const prevReplies = p.respuestas[padreId] ?? { items: [], pagina: 0, hayMas: false, loading: false }
        return {
          byPost: {
            ...s.byPost,
            [pubId]: {
              ...p,
              enviando: false,
              comentarios: patchComment(p.comentarios, padreId, (c) => ({ ...c, conteoRespuestas: c.conteoRespuestas + 1 })),
              respuestas: { ...p.respuestas, [padreId]: { ...prevReplies, items: [...prevReplies.items, data] } },
            },
          },
        }
      })
    } catch {
      set((s) => ({ byPost: { ...s.byPost, [pubId]: { ...s.byPost[pubId], enviando: false } } }))
    }
  },

  eliminar: async (pubId, comentarioId, padreId) => {
    await eliminarComentario(comentarioId)
    set((s) => {
      const p = s.byPost[pubId]
      if (!p) return s
      if (padreId != null) {
        const replies = p.respuestas[padreId]
        return {
          byPost: {
            ...s.byPost,
            [pubId]: {
              ...p,
              comentarios: patchComment(p.comentarios, padreId, (c) => ({
                ...c, conteoRespuestas: Math.max(0, c.conteoRespuestas - 1),
              })),
              respuestas: replies
                ? { ...p.respuestas, [padreId]: { ...replies, items: replies.items.filter((r) => r.id !== comentarioId) } }
                : p.respuestas,
            },
          },
        }
      }
      return { byPost: { ...s.byPost, [pubId]: { ...p, comentarios: p.comentarios.filter((c) => c.id !== comentarioId) } } }
    })
  },

  toggleReaccion: async (pubId, comentarioId, tipo, padreId) => {
    const p = get().byPost[pubId]
    if (!p) return
    const comentario = padreId != null
      ? p.respuestas[padreId]?.items.find((r) => r.id === comentarioId)
      : p.comentarios.find((c) => c.id === comentarioId)
    if (!comentario) return

    const actual = comentario.reaccion
    const quitando = actual === tipo

    const applyPatch = (fn: (c: Comentario) => Comentario) =>
      set((s) => {
        const post = s.byPost[pubId]
        if (!post) return s
        if (padreId != null) {
          const replies = post.respuestas[padreId]
          if (!replies) return s
          return {
            byPost: {
              ...s.byPost,
              [pubId]: {
                ...post,
                respuestas: { ...post.respuestas, [padreId]: { ...replies, items: patchComment(replies.items, comentarioId, fn) } },
              },
            },
          }
        }
        return { byPost: { ...s.byPost, [pubId]: { ...post, comentarios: patchComment(post.comentarios, comentarioId, fn) } } }
      })

    applyPatch((c) => ({
      ...c,
      reaccion: quitando ? undefined : tipo,
      conteoReacciones: quitando ? c.conteoReacciones - 1 : actual ? c.conteoReacciones : c.conteoReacciones + 1,
    }))

    try {
      quitando ? await quitarReaccionComentario(comentarioId) : await reaccionarComentario(comentarioId, tipo)
    } catch {
      applyPatch(() => comentario) // rollback
    }
  },

  cargarRespuestas: async (pubId, comentarioId) => {
    const p = get().byPost[pubId]
    const prev = p?.respuestas[comentarioId] ?? { items: [], pagina: 0, hayMas: true, loading: false }
    if (prev.loading) return
    set((s) => {
      const post = s.byPost[pubId] ?? initPost()
      return { byPost: { ...s.byPost, [pubId]: { ...post, respuestas: { ...post.respuestas, [comentarioId]: { ...prev, loading: true } } } } }
    })
    try {
      const { data } = await getRespuestas(comentarioId, 0)
      set((s) => {
        const post = s.byPost[pubId]
        if (!post) return s
        return {
          byPost: {
            ...s.byPost,
            [pubId]: {
              ...post,
              respuestas: {
                ...post.respuestas,
                [comentarioId]: { items: data.content, pagina: 0, hayMas: !data.last, loading: false },
              },
            },
          },
        }
      })
    } catch {
      set((s) => {
        const post = s.byPost[pubId]
        if (!post) return s
        return { byPost: { ...s.byPost, [pubId]: { ...post, respuestas: { ...post.respuestas, [comentarioId]: { ...prev, loading: false } } } } }
      })
    }
  },
}))