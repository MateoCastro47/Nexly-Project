package com.edu.mcs.NexlyBack.DTOs.Admin;

import java.util.Map;

public record AdminStatsDTO(
    long usuarios,
    long usuariosActivos,
    long usuariosVerificados,
    long nuevosUsuarios7d,
    long publicaciones,
    long comunidades,
    long comunidadesPublicas,
    long comentarios,
    long reacciones,
    Map<String, Long> publicacionesPorTipo
) {}
