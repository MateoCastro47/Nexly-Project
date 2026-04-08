package com.edu.mcs.NexlyBack.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Conversacion")
public class Conversacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100)
    private String nombre;

    private String foto;

    @Column(name = "es_grupal", nullable = false)
    private Boolean esGrupal = false;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "ultimo_mensaje")
    private LocalDateTime ultimoMensaje;

    public Conversacion() {
    }

    public Conversacion(Long id, String nombre, String foto, Boolean esGrupal, LocalDateTime fechaCreacion,
                        LocalDateTime ultimoMensaje) {
        this.id = id;
        this.nombre = nombre;
        this.foto = foto;
        this.esGrupal = esGrupal;
        this.fechaCreacion = fechaCreacion;
        this.ultimoMensaje = ultimoMensaje;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public Boolean getEsGrupal() {
        return esGrupal;
    }

    public void setEsGrupal(Boolean esGrupal) {
        this.esGrupal = esGrupal;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getUltimoMensaje() {
        return ultimoMensaje;
    }

    public void setUltimoMensaje(LocalDateTime ultimoMensaje) {
        this.ultimoMensaje = ultimoMensaje;
    }

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        if (this.esGrupal == null) this.esGrupal = false;
    }
}
