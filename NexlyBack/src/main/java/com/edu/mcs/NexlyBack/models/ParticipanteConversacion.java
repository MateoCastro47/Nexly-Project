package com.edu.mcs.NexlyBack.models;

import com.edu.mcs.NexlyBack.models.Keys.ParticipanteConversacionId;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ParticipanteConversacion")
@IdClass(ParticipanteConversacionId.class)
public class ParticipanteConversacion {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversacion_id", nullable = false)
    private Conversacion conversacion;

    @Column(name = "es_admin", nullable = false)
    private Boolean esAdmin = false;

    @Column(nullable = false)
    private Boolean archivada = false;

    @Column(nullable = false)
    private Boolean silenciada = false;

    @Column(name = "fecha_union", nullable = false)
    private LocalDateTime fechaUnion;

    public ParticipanteConversacion() {
    }

    public ParticipanteConversacion(Usuario usuario, Conversacion conversacion, Boolean esAdmin,
                                    Boolean archivada, Boolean silenciada, LocalDateTime fechaUnion) {
        this.usuario = usuario;
        this.conversacion = conversacion;
        this.esAdmin = esAdmin;
        this.archivada = archivada;
        this.silenciada = silenciada;
        this.fechaUnion = fechaUnion;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Conversacion getConversacion() {
        return conversacion;
    }

    public void setConversacion(Conversacion conversacion) {
        this.conversacion = conversacion;
    }

    public Boolean getEsAdmin() {
        return esAdmin;
    }

    public void setEsAdmin(Boolean esAdmin) {
        this.esAdmin = esAdmin;
    }

    public Boolean getArchivada() {
        return archivada;
    }

    public void setArchivada(Boolean archivada) {
        this.archivada = archivada;
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
        if (this.esAdmin == null) this.esAdmin = false;
        if (this.archivada == null) this.archivada = false;
        if (this.silenciada == null) this.silenciada = false;
    }
}
