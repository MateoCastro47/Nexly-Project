import type { Comunidad, Usuario } from "../types";
import client from "./client";

export const buscarUsuarios = (q: string) => 
    client.get<Usuario[]>('/usuario/buscar', {params: { q } })

export const buscarComunidades = (q: string) => 
    client.get<Comunidad[]>('/comunidades/buscar', {params: { q } })

