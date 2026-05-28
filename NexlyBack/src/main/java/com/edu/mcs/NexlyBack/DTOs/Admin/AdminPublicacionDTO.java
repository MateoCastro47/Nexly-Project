package com.edu.mcs.NexlyBack.DTOs.Admin;

import java.time.LocalDateTime;

public record AdminPublicacionDTO(
    Long id,
    String contenido,
    Long autorId,
    String autorUsername,
    String comunidadNombre,
    String tipoPost,
    LocalDateTime fechaCreacion
) {}
