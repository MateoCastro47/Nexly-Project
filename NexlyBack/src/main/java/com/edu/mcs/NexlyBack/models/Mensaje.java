package com.edu.mcs.NexlyBack.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Mensaje")
public class Mensaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversacion_id", nullable = false)
    private Conversacion conversacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "remitente_id", nullable = false)
    private Usuario remitente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mensaje_padre_id")
    private Mensaje mensajePadre;

    @Column(columnDefinition = "TEXT")
    private String contenido;

    @Column(name = "imagen_url")
    private String imagenUrl;

    @Column(name = "fecha_envio", nullable = false, updatable = false)
    private LocalDateTime fechaEnvio;

    @Column(name = "fecha_edicion")
    private LocalDateTime fechaEdicion;

    @Column(nullable = false)
    private Boolean eliminado = false;

    public Mensaje() {
    }

    public Mensaje(Long id, Conversacion conversacion, Usuario remitente, Mensaje mensajePadre,
                   String contenido, String imagenUrl, LocalDateTime fechaEnvio,
                   LocalDateTime fechaEdicion, Boolean eliminado) {
        this.id = id;
        this.conversacion = conversacion;
        this.remitente = remitente;
        this.mensajePadre = mensajePadre;
        this.contenido = contenido;
        this.imagenUrl = imagenUrl;
        this.fechaEnvio = fechaEnvio;
        this.fechaEdicion = fechaEdicion;
        this.eliminado = eliminado;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Conversacion getConversacion() {
        return conversacion;
    }

    public void setConversacion(Conversacion conversacion) {
        this.conversacion = conversacion;
    }

    public Usuario getRemitente() {
        return remitente;
    }

    public void setRemitente(Usuario remitente) {
        this.remitente = remitente;
    }

    public Mensaje getMensajePadre() {
        return mensajePadre;
    }

    public void setMensajePadre(Mensaje mensajePadre) {
        this.mensajePadre = mensajePadre;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public LocalDateTime getFechaEnvio() {
        return fechaEnvio;
    }

    public void setFechaEnvio(LocalDateTime fechaEnvio) {
        this.fechaEnvio = fechaEnvio;
    }

    public LocalDateTime getFechaEdicion() {
        return fechaEdicion;
    }

    public void setFechaEdicion(LocalDateTime fechaEdicion) {
        this.fechaEdicion = fechaEdicion;
    }

    public Boolean getEliminado() {
        return eliminado;
    }

    public void setEliminado(Boolean eliminado) {
        this.eliminado = eliminado;
    }

    @PrePersist
    protected void onCreate() {
        this.fechaEnvio = LocalDateTime.now();
        if (this.eliminado == null) this.eliminado = false;
    }
}
