package com.edu.mcs.NexlyBack.DTOs.Admin;

import java.time.LocalDateTime;

public record AdminComunidadDTO(
    Long id,
    String nombre,
    String categoria,
    String creadorUsername,
    long totalMiembros,
    boolean esPublica,
    LocalDateTime fechaCreacion
) {}
