package com.edu.mcs.NexlyBack.models.Keys;

import java.io.Serializable;

public class BloqueoId implements Serializable {
    private Long bloqueador;
    private Long bloqueado;

    public BloqueoId() {
    }

    public BloqueoId(Long bloqueador, Long bloqueado) {
        this.bloqueador = bloqueador;
        this.bloqueado = bloqueado;
    }

    public Long getBloqueador() {
        return bloqueador;
    }

    public void setBloqueador(Long bloqueador) {
        this.bloqueador = bloqueador;
    }

    public Long getBloqueado() {
        return bloqueado;
    }

    public void setBloqueado(Long bloqueado) {
        this.bloqueado = bloqueado;
    }
}
