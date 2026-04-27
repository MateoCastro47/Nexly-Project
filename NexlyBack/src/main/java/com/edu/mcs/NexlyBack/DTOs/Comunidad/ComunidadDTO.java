package com.edu.mcs.NexlyBack.DTOs.Comunidad;

import com.edu.mcs.NexlyBack.DTOs.Publicacion.AutorResumenDTO;

public record ComunidadDTO(
    Long id,
    String nombre,
    String descripcion,
    String reglas,
    String foto,
    Boolean esPublica,
    AutorResumenDTO creador,
    String categoria,
    Long totalMiembros,
    boolean esMiembro,
    boolean esCreador
){}
