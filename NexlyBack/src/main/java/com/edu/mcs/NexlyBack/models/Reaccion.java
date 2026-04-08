package com.edu.mcs.NexlyBack.models;

import com.edu.mcs.NexlyBack.models.Enums.TipoReaccion;
import com.edu.mcs.NexlyBack.models.Keys.ReaccionId;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Reaccion")
@IdClass(ReaccionId.class)
public class Reaccion {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publicacion_id", nullable = false)
    private Publicacion publicacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoReaccion tipo;

    @Column(nullable = false)
    private LocalDateTime fecha;

    public Reaccion() {
    }

    public Reaccion(Usuario usuario, Publicacion publicacion, TipoReaccion tipo, LocalDateTime fecha) {
        this.usuario = usuario;
        this.publicacion = publicacion;
        this.tipo = tipo;
        this.fecha = fecha;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Publicacion getPublicacion() {
        return publicacion;
    }

    public void setPublicacion(Publicacion publicacion) {
        this.publicacion = publicacion;
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
