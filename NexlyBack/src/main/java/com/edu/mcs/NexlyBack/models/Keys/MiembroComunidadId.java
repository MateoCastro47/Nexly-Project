package com.edu.mcs.NexlyBack.models.Keys;

import java.io.Serializable;

public class MiembroComunidadId implements Serializable {
    private Long usuario;
    private Long comunidad;

    public MiembroComunidadId() {
    }

    public MiembroComunidadId(Long usuario, Long comunidad) {
        this.usuario = usuario;
        this.comunidad = comunidad;
    }

    public Long getUsuario() {
        return usuario;
    }

    public void setUsuario(Long usuario) {
        this.usuario = usuario;
    }

    public Long getComunidad() {
        return comunidad;
    }

    public void setComunidad(Long comunidad) {
        this.comunidad = comunidad;
    }
}