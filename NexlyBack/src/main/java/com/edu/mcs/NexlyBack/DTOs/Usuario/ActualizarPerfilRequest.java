package com.edu.mcs.NexlyBack.DTOs.Usuario;

import jakarta.validation.constraints.Size;

public record ActualizarPerfilRequest(
    @Size(max = 100) String nombreCompleto,
    @Size(max = 160) String biografia,
    @Size(max = 100) String ubicacion,
    @Size(max = 200) String enlaceWeb,
                     String fotoPerfil,
                     String fotoPortada,
                     Boolean perfilPrivado
) {}
