package com.edu.mcs.NexlyBack.DTOs.Mensaje;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public record CrearGrupoRequest(
    @NotBlank String nombre,
    @NotEmpty List<Long> participanteIds
) {}
