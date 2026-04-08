package com.edu.mcs.NexlyBack.models;

import com.edu.mcs.NexlyBack.models.Enums.EstadoSeguimiento;
import com.edu.mcs.NexlyBack.models.Keys.SeguimientoId;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Seguimiento")
@IdClass(SeguimientoId.class)
public class Seguimiento {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seguidor_id", nullable = false)
    private Usuario seguidor;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seguido_id", nullable = false)
    private Usuario seguido;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoSeguimiento estado = EstadoSeguimiento.PENDIENTE;

    @Column(nullable = false)
    private Boolean silenciado = false;

    @Column(nullable = false)
    private LocalDateTime fecha;

    public Seguimiento() {
    }

    public Seguimiento(Usuario seguidor, Usuario seguido, EstadoSeguimiento estado, Boolean silenciado,
                       LocalDateTime fecha) {
        this.seguidor = seguidor;
        this.seguido = seguido;
        this.estado = estado;
        this.silenciado = silenciado;
        this.fecha = fecha;
    }

    public Usuario getSeguidor() {
        return seguidor;
    }

    public void setSeguidor(Usuario seguidor) {
        this.seguidor = seguidor;
    }

    public Usuario getSeguido() {
        return seguido;
    }

    public void setSeguido(Usuario seguido) {
        this.seguido = seguido;
    }

    public EstadoSeguimiento getEstado() {
        return estado;
    }

    public void setEstado(EstadoSeguimiento estado) {
        this.estado = estado;
    }

    public Boolean getSilenciado() {
        return silenciado;
    }

    public void setSilenciado(Boolean silenciado) {
        this.silenciado = silenciado;
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
        if (this.estado == null) this.estado = EstadoSeguimiento.PENDIENTE;
        if (this.silenciado == null) this.silenciado = false;
    }
}
