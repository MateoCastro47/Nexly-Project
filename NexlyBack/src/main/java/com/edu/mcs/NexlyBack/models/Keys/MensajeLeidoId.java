package com.edu.mcs.NexlyBack.models.Keys;

import java.io.Serializable;

public class MensajeLeidoId implements Serializable {
    private Long mensaje;
    private Long usuario;

    public MensajeLeidoId() {
    }

    public MensajeLeidoId(Long mensaje, Long usuario) {
        this.mensaje = mensaje;
        this.usuario = usuario;
    }

    public Long getMensaje() {
        return mensaje;
    }

    public void setMensaje(Long mensaje) {
        this.mensaje = mensaje;
    }

    public Long getUsuario() {
        return usuario;
    }

    public void setUsuario(Long usuario) {
        this.usuario = usuario;
    }
}
