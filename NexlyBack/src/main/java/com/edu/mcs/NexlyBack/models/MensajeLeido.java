package com.edu.mcs.NexlyBack.models;

import com.edu.mcs.NexlyBack.models.Keys.MensajeLeidoId;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "MensajeLeido")
@IdClass(MensajeLeidoId.class)
public class MensajeLeido {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mensaje_id", nullable = false)
    private Mensaje mensaje;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "fecha_lectura", nullable = false)
    private LocalDateTime fechaLectura;

    public MensajeLeido() {
    }

    public MensajeLeido(Mensaje mensaje, Usuario usuario, LocalDateTime fechaLectura) {
        this.mensaje = mensaje;
        this.usuario = usuario;
        this.fechaLectura = fechaLectura;
    }

    public Mensaje getMensaje() {
        return mensaje;
    }

    public void setMensaje(Mensaje mensaje) {
        this.mensaje = mensaje;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public LocalDateTime getFechaLectura() {
        return fechaLectura;
    }

    public void setFechaLectura(LocalDateTime fechaLectura) {
        this.fechaLectura = fechaLectura;
    }

    @PrePersist
    protected void onCreate() {
        this.fechaLectura = LocalDateTime.now();
    }
}
