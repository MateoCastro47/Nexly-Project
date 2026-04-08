package com.edu.mcs.NexlyBack.models;

import com.edu.mcs.NexlyBack.models.Enums.TipoReaccion;
import com.edu.mcs.NexlyBack.models.Keys.ReaccionComentarioId;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ReaccionComentario")
@IdClass(ReaccionComentarioId.class)
public class ReaccionComentario {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comentario_id", nullable = false)
    private Comentario comentario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoReaccion tipo;

    @Column(nullable = false)
    private LocalDateTime fecha;

    public ReaccionComentario() {
    }

    public ReaccionComentario(Usuario usuario, Comentario comentario, TipoReaccion tipo, LocalDateTime fecha) {
        this.usuario = usuario;
        this.comentario = comentario;
        this.tipo = tipo;
        this.fecha = fecha;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Comentario getComentario() {
        return comentario;
    }

    public void setComentario(Comentario comentario) {
        this.comentario = comentario;
    }

    public TipoReaccion getTipo() {
        return tipo;
    }

    public void setTipo(TipoReaccion tipo) {
        this.tipo = tipo;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    @PrePersist
    protected void onCreate() {
        this.fecha = LocalDateTime.now();
    }
}
