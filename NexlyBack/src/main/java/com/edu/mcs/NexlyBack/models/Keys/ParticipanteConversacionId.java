package com.edu.mcs.NexlyBack.models.Keys;

import java.io.Serializable;

public class ParticipanteConversacionId implements Serializable {
    private Long usuario;
    private Long conversacion;

    public ParticipanteConversacionId() {
    }

    public ParticipanteConversacionId(Long usuario, Long conversacion) {
        this.usuario = usuario;
        this.conversacion = conversacion;
    }

    public Long getUsuario() {
        return usuario;
    }

    public void setUsuario(Long usuario) {
        this.usuario = usuario;
    }

    public Long getConversacion() {
        return conversacion;
    }

    public void setConversacion(Long conversacion) {
        this.conversacion = conversacion;
    }
}