package com.edu.mcs.NexlyBack.models;

import com.edu.mcs.NexlyBack.models.Enums.EstadoMiembro;
import com.edu.mcs.NexlyBack.models.Enums.RolComunidad;
import com.edu.mcs.NexlyBack.models.Keys.MiembroComunidadId;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "MiembroComunidad")
@IdClass(MiembroComunidadId.class)
public class MiembroComunidad {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comunidad_id", nullable = false)
    private Comunidad comunidad;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RolComunidad rol = RolComunidad.MIEMBRO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoMiembro estado = EstadoMiembro.PENDIENTE;

    @Column(nullable = false)
    private Boolean baneado = false;

    @Column(nullable = false)
    private Boolean silenciada = false;

    @Column(name = "fecha_union", nullable = false)
    private LocalDateTime fechaUnion;

    public MiembroComunidad() {
    }

    public MiembroComunidad(Usuario usuario, Comunidad comunidad, RolComunidad rol, EstadoMiembro estado,
                            Boolean baneado, Boolean silenciada, LocalDateTime fechaUnion) {
        this.usuario = usuario;
        this.comunidad = comunidad;
        this.rol = rol;
        this.estado = estado;
        this.baneado = baneado;
        this.silenciada = silenciada;
        this.fechaUnion = fechaUnion;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Comunidad getComunidad() {
        return comunidad;
    }

    public void setComunidad(Comunidad comunidad) {
        this.comunidad = comunidad;
    }

    public RolComunidad getRol() {
        return rol;
    }

    public void setRol(RolComunidad rol) {
        this.rol = rol;
    }

    public EstadoMiembro getEstado() {
        return estado;
    }

    public void setEstado(EstadoMiembro estado) {
        this.estado = estado;
    }

    public Boolean getBaneado() {
        return baneado;
    }

    public void setBaneado(Boolean baneado) {
        this.baneado = baneado;
    }

    public Boolean getSilenciada() {
        return silenciada;
    }

    public void setSilenciada(Boolean silenciada) {
        this.silenciada = silenciada;
    }

    public LocalDateTime getFechaUnion() {
        return fechaUnion;
    }

    public void setFechaUnion(LocalDateTime fechaUnion) {
        this.fechaUnion = fechaUnion;
    }

    @PrePersist
    protected void onCreate() {
        this.fechaUnion = LocalDateTime.now();
        if (this.rol == null) this.rol = RolComunidad.MIEMBRO;
        if (this.estado == null) this.estado = EstadoMiembro.PENDIENTE;
        if (this.baneado == null) this.baneado = false;
        if (this.silenciada == null) this.silenciada = false;
    }
}
