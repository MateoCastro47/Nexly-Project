package com.edu.mcs.NexlyBack.DTOs.Admin;

import java.time.LocalDateTime;

public record AdminUsuarioDTO(
    Long id,
    String nombreCompleto,
    String nombreUsuario,
    String email,
    String rol,
    boolean activo,
    boolean emailVerificado,
    LocalDateTime fechaRegistro
) {}
