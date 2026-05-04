import PostCard from '../../components/feed/PostCard'
import type { Publicacion } from '../../types'

const MOCK: Publicacion[] = [
  {
    id: 1,
    contenido: '¡Primera publicación en Nexly! Conecta, comparte y crece con nosotros. 🚀',
    imagenes: [],
    visibilidad: 'PUBLICO',
    autor: {
      id: 1,
      nombreCompleto: 'Mateo Castro',
      nombreUsuario: 'mateocastro',
      email: 'mateo@nexly.com',
      seguidores: 128,
      seguidos: 64,
      activo: true,
      rol: 'USER',
    },
    fechaCreacion: new Date(Date.now() - 5 * 60_000).toISOString(),
    totalReacciones: 12,
    totalComentarios: 3,
  },
  {
    id: 2,
    contenido: 'Explorando las comunidades de tecnología. ¿Alguien más por aquí?',
    imagenes: [],
    visibilidad: 'PUBLICO',
    autor: {
      id: 2,
      nombreCompleto: 'Laura Gómez',
      nombreUsuario: 'lauragomez',
      email: 'laura@nexly.com',
      seguidores: 340,
      seguidos: 210,
      activo: true,
      rol: 'USER',
    },
    comunidadNombre: 'Tecnología',
    fechaCreacion: new Date(Date.now() - 2 * 3_600_000).toISOString(),
    totalReacciones: 47,
    totalComentarios: 11,
    miReaccion: 'ME_GUSTA',
  },
]

export default function FeedPage() {
  return (
    <div className="flex flex-col gap-4">
      {MOCK.map((p) => (
        <PostCard key={p.id} publicacion={p} />
      ))}
    </div>
  )
}
