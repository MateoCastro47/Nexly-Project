package com.edu.mcs.NexlyBack.DTOs.Usuario;

import java.time.LocalDateTime;

public class SolicitudSeguimientoDTO {
    private Long seguidorId;
    private String nombreUsuario;
    private String nombreCompleto;
    private String fotoPerfil;
    private LocalDateTime fecha;

    public SolicitudSeguimientoDTO() {}

    public SolicitudSeguimientoDTO(Long seguidorId, String nombreUsuario, String nombreCompleto, String fotoPerfil,
            LocalDateTime fecha) {
        this.seguidorId = seguidorId;
        this.nombreUsuario = nombreUsuario;
        this.nombreCompleto = nombreCompleto;
        this.fotoPerfil = fotoPerfil;
        this.fecha = fecha;
    }

    public Long getSeguidorId() {
        return seguidorId;
    }

    public void setSeguidorId(Long seguidorId) {
        this.seguidorId = seguidorId;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

}
