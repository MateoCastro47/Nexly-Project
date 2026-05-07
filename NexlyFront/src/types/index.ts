export interface Usuario {
  id: number
  nombreCompleto: string
  nombreUsuario: string
  email: string
  fotoPerfil?: string
  fotoPortada?: string
  biografia?: string
  seguidores: number
  seguidos: number
  siguiendo?: boolean
  bloqueado?: boolean
  activo: boolean
  rol: string
  onboardingCompletado: boolean
}

export interface Publicacion {
  id: number
  contenido: string
  imagenes: string[]
  visibilidad: 'PUBLICA' | 'SEGUIDORES' | 'PRIVADA'
  autor: Usuario
  comunidadId?: number
  comunidadNombre?: string
  fechaCreacion: string
  conteoReacciones: number
  conteoComentarios: number
  reaccionDelVisor?: TipoReaccion
}

export interface Comentario {
  id: number
  contenido: string
  autor: Usuario
  fechaCreacion: string
  totalRespuestas: number
  totalReacciones: number
  miReaccion?: TipoReaccion
  comentarioPadreId?: number
}

export interface Notificacion {
  id: number
  tipo: 'NUEVO_SEGUIDOR' | 'NUEVA_REACCION_PUBLICACION' | 'NUEVO_COMENTARIO' | 'NUEVO_MENSAJE'
  contenido: string
  leida: boolean
  fechaCreacion: string
  emisorId?: number
  emisorNombre?: string
  emisorFoto?: string
  referenciaId?: number
}

export interface Conversacion {
  id: number
  esGrupo: boolean
  nombre?: string
  participantes: Usuario[]
  ultimoMensaje?: Mensaje
  noLeidos: number
}

export interface Mensaje {
  id: number
  contenido: string
  emisorId: number
  emisorNombre: string
  emisorFoto?: string
  conversacionId: number
  fechaEnvio: string
  leido: boolean
}

export interface Comunidad {
  id: number
  nombre: string
  descripcion?: string
  imagenUrl?: string
  portadaUrl?: string
  totalMiembros: number
  esPublica: boolean
  miRol?: 'ADMIN' | 'MODERADOR' | 'MIEMBRO'
  esMiembro: boolean
  silenciada?: boolean
}

export interface MiembroComunidad {
  usuarioId: number
  nombreCompleto: string
  nombreUsuario: string
  fotoPerfil?: string
  rol: 'ADMIN' | 'MODERADOR' | 'MIEMBRO'
  estado: 'ACTIVO' | 'PENDIENTE' | 'BANEADO'
}

export type TipoReaccion = 'ME_GUSTA' | 'ME_ENCANTA' | 'DIVERTIDO' | 'SORPRENDIDO' | 'TRISTE' | 'ENOJADO'

export interface AuthResponse {
  token: string
  usuario: Usuario
}

export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number
  last: boolean
}
