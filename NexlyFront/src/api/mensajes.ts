import  type { Mensaje, Page, Conversacion } from "../types";
import client from "./client";

export const getConversaciones = () => 
    client.get<Conversacion[]>('/mensajes/conversaciones')

export const getMensajes = (id: number, page = 0, size = 30) => 
    client.get<Page<Mensaje>>(`/mensajes/conversaciones/${id}`, {
        params: {page, size}
    })

export const iniciarDirecta = (otroId: number) =>
    client.post<Conversacion>(`/mensajes/directa/${otroId}`)

export const enviarMensajeREST = (id: number, contenido: string) =>
    client.post<Mensaje>(`/mensajes/conversaciones/${id}`, {contenido})

export const marcarLeidos = (id: number) => 
    client.post<void> (`/mensajes/conversaciones/${id}/leer`)