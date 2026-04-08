package com.edu.mcs.NexlyBack.models.Keys;

import java.io.Serializable;

public class SeguimientoId implements Serializable {
    private Long seguidor;
    private Long seguido;

    public SeguimientoId() {
    }

    public SeguimientoId(Long seguidor, Long seguido) {
        this.seguidor = seguidor;
        this.seguido = seguido;
    }

    public Long getSeguidor() {
        return seguidor;
    }

    public void setSeguidor(Long seguidor) {
        this.seguidor = seguidor;
    }

    public Long getSeguido() {
        return seguido;
    }

    public void setSeguido(Long seguido) {
        this.seguido = seguido;
    }
}
