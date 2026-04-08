package com.edu.mcs.NexlyBack.models.Keys;

import java.io.Serializable;

public class ReaccionComentarioId implements Serializable {
    private Long usuario;
    private Long comentario;

    public ReaccionComentarioId() {
    }

    public ReaccionComentarioId(Long usuario, Long comentario) {
        this.usuario = usuario;
        this.comentario = comentario;
    }

    public Long getUsuario() {
        return usuario;
    }

    public void setUsuario(Long usuario) {
        this.usuario = usuario;
    }

    public Long getComentario() {
        return comentario;
    }

    public void setComentario(Long comentario) {
        this.comentario = comentario;
    }
}
