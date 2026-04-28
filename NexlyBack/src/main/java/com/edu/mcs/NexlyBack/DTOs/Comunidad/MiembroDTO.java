package com.edu.mcs.NexlyBack.DTOs.Comunidad;

import java.time.LocalDateTime;

import com.edu.mcs.NexlyBack.models.Enums.RolComunidad;

public record MiembroDTO(
    Long usuarioId,
    String nombreUsuario,
    String fotoPerfil,
    RolComunidad rol,
    LocalDateTime fechaUnion
) {}
