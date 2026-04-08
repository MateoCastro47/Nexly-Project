package com.edu.mcs.NexlyBack.models.Keys;

import java.io.Serializable;

public class ReaccionId implements Serializable {
    private Long usuario;
    private Long publicacion;

    public ReaccionId() {
    }

    public ReaccionId(Long usuario, Long publicacion) {
        this.usuario = usuario;
        this.publicacion = publicacion;
    }

    public Long getUsuario() {
        return usuario;
    }

    public void setUsuario(Long usuario) {
        this.usuario = usuario;
    }

    public Long getPublicacion() {
        return publicacion;
    }

    public void setPublicacion(Long publicacion) {
        this.publicacion = publicacion;
    }
}