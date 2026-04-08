package com.edu.mcs.NexlyBack.models;

import com.edu.mcs.NexlyBack.models.Keys.BloqueoId;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Bloqueo")
@IdClass(BloqueoId.class)
public class Bloqueo {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bloqueador_id", nullable = false)
    private Usuario bloqueador;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bloqueado_id", nullable = false)
    private Usuario bloqueado;

    @Column(nullable = false)
    private LocalDateTime fecha;

    public Bloqueo() {
    }

    public Bloqueo(Usuario bloqueador, Usuario bloqueado, LocalDateTime fecha) {
        this.bloqueador = bloqueador;
        this.bloqueado = bloqueado;
        this.fecha = fecha;
    }

    public Usuario getBloqueador() {
        return bloqueador;
    }

    public void setBloqueador(Usuario bloqueador) {
        this.bloqueador = bloqueador;
    }

    public Usuario getBloqueado() {
        return bloqueado;
    }

    public void setBloqueado(Usuario bloqueado) {
        this.bloqueado = bloqueado;
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
