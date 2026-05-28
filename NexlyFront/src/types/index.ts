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
  perfilPrivado?: boolean
}

export type TipoPost = 'NORMAL' | 'PREGUNTA' | 'NOTICIA' | 'DEBATE' | 'ANUNCIO'

export interface PublicacionCitada {
  id: number
  contenido: string
  autor: Pick<Usuario, 'id' | 'nombreCompleto' | 'nombreUsuario' | 'fotoPerfil'>
  imagenes: string[]
  fechaCreacion: string
}

export interface Publicacion {
  id: number
  contenido: string
  imagenes: string[]
  visibilidad: 'PUBLICA' | 'SEGUIDORES' | 'PRIVADA'
  tipoPost: TipoPost
  fijada: boolean
  autor: Usuario
  comunidadId?: number
  comunidadNombre?: string
  publicacionCitada?: PublicacionCitada
  fechaCreacion: string
  conteoReacciones: number
  conteoComentarios: number
  reaccionDelVisor?: TipoReaccion
}

export interface Comentario {
  id: number
  contenido: string
  autor: Pick<Usuario, 'id' | 'nombreCompleto' | 'nombreUsuario' | 'fotoPerfil'>
  publicacionId: number
  comentarioPadreId?: number
  fechaCreacion: string
  fechaEdicion?: string
  conteoRespuestas: number
  conteoReacciones: number
  reaccion?: TipoReaccion
}

export interface Notificacion {
  id: number
  tipo:
    | 'NUEVO_SEGUIDOR'
    | 'NUEVA_REACCION_PUBLICACION'
    | 'NUEVO_COMENTARIO'
    | 'NUEVA_REACCION_COMENTARIO'
    | 'NUEVO_MENSAJE'
    | 'NUEVA_SOLICITUD_SEGUIMIENTO'
  leida: boolean
  fechaCreacion: string
  emisorId?: number
  emisorUsername?: string
  emisorFotoPerfil?: string
  entidadId?: number
}

export interface SolicitudSeguimiento {
  seguidorId: number
  nombreUsuario: string
  nombreCompleto: string
  fotoPerfil?: string
  fecha: string
}

export interface ParticipanteConversacion{
  id: number;
  username: string;
  fotoPerfil?: string;

}

export interface Conversacion{
  id: number;
  nombre?: string;
  foto?: string;
  esGrupal: boolean;
  ultimoMensaje?: string;
  ultimoMensajePreview?: string;
  noLeidos: number;
  participantes: ParticipanteConversacion[];
}

export interface Mensaje{
  id: number;
  conversacionId: number;
  autorId: number;
  autorUsername:string;
  autorFoto?: string;
  contenido: string;
  fechaEnvia: string;
  pendiente?: boolean;
  error?: boolean;
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

export type RolComunidad = 'ADMIN' | 'MOD' | 'MIEMBRO'

export interface AutorResumen {
  id: number
  nombreCompleto: string
  nombreUsuario: string
  fotoPerfil?: string
}

export interface Comunidad {
  id: number
  nombre: string
  descripcion?: string
  reglas?: string
  foto?: string
  esPublica: boolean
  creador?: AutorResumen
  categoria?: string
  totalMiembros: number
  esMiembro: boolean
  esCreador: boolean
  miRol?: RolComunidad
}

export interface MiembroComunidad {
  usuarioId: number
  nombreUsuario: string
  fotoPerfil?: string
  rol: RolComunidad
  fechaUnion: string
}

