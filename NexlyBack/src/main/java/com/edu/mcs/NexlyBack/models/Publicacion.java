package com.edu.mcs.NexlyBack.models;

import com.edu.mcs.NexlyBack.models.Enums.Visibilidad;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Publicacion")
public class Publicacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comunidad_id")
    private Comunidad comunidad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publicacion_ref_id")
    private Publicacion publicacionRef;

    @Column(columnDefinition = "TEXT")
    private String contenido;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Visibilidad visibilidad = Visibilidad.PUBLICA;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_edicion")
    private LocalDateTime fechaEdicion;

    @Column(nullable = false)
    private Boolean fijada = false;

    @Column(name = "comentarios_activos", nullable = false)
    private Boolean comentariosActivos = true;

    @OneToMany(mappedBy = "publicacion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PublicacionImagen> imagenes;

    public Publicacion() {
    }

    public Publicacion(Long id, Usuario usuario, Comunidad comunidad, Publicacion publicacionRef, String contenido,
                       Visibilidad visibilidad, LocalDateTime fechaCreacion, LocalDateTime fechaEdicion,
                       Boolean fijada, Boolean comentariosActivos, List<PublicacionImagen> imagenes) {
        this.id = id;
        this.usuario = usuario;
        this.comunidad = comunidad;
        this.publicacionRef = publicacionRef;
        this.contenido = contenido;
        this.visibilidad = visibilidad;
        this.fechaCreacion = fechaCreacion;
        this.fechaEdicion = fechaEdicion;
        this.fijada = fijada;
        this.comentariosActivos = comentariosActivos;
        this.imagenes = imagenes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Publicacion getPublicacionRef() {
        return publicacionRef;
    }

    public void setPublicacionRef(Publicacion publicacionRef) {
        this.publicacionRef = publicacionRef;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public Visibilidad getVisibilidad() {
        return visibilidad;
    }

    public void setVisibilidad(Visibilidad visibilidad) {
        this.visibilidad = visibilidad;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaEdicion() {
        return fechaEdicion;
    }

    public void setFechaEdicion(LocalDateTime fechaEdicion) {
        this.fechaEdicion = fechaEdicion;
    }

    public Boolean getFijada() {
        return fijada;
    }

    public void setFijada(Boolean fijada) {
        this.fijada = fijada;
    }

    public Boolean getComentariosActivos() {
        return comentariosActivos;
    }

    public void setComentariosActivos(Boolean comentariosActivos) {
        this.comentariosActivos = comentariosActivos;
    }

    public List<PublicacionImagen> getImagenes() {
        return imagenes;
    }

    public void setImagenes(List<PublicacionImagen> imagenes) {
        this.imagenes = imagenes;
    }

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        if (this.visibilidad == null) this.visibilidad = Visibilidad.PUBLICA;
        if (this.fijada == null) this.fijada = false;
        if (this.comentariosActivos == null) this.comentariosActivos = true;
    }
}
