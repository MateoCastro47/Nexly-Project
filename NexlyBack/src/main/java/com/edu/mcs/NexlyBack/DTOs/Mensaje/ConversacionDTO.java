package com.edu.mcs.NexlyBack.DTOs.Mensaje;

import java.time.LocalDateTime;
import java.util.List;

public record ConversacionDTO(
    Long id,
    String nombre,
    String foto,
    Boolean esGrupal,
    LocalDateTime ultimoMensaje,
    String ultimoMensajePreview,
    Long noLeidos,
    List<ParticipanteDTO> participantes
) {}
