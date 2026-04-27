package com.edu.mcs.NexlyBack.DTOs.Comunidad;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CrearComunidadRequest(
    @NotBlank @Size(min = 3, max = 100) String nombre,
    String descripcion,
    String reglas,
    String foto,
    Boolean esPublica,
    Long categoriaId
) {}