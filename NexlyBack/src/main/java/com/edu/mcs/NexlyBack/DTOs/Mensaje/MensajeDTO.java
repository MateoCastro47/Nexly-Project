package com.edu.mcs.NexlyBack.DTOs.Mensaje;

import java.time.LocalDateTime;

public record MensajeDTO(
    Long id,
    Long conversacionId,
    Long autorId,
    String autorUsername,
    String autorFoto,
    String contenido,
    LocalDateTime fechaEnvia
) {}
