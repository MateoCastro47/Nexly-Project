package com.edu.mcs.NexlyBack.models;

import jakarta.persistence.*;

@Entity
@Table(name = "PublicacionImagen")
public class PublicacionImagen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publicacion_id", nullable = false)
    private Publicacion publicacion;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private Short orden = 0;

    public PublicacionImagen() {
    }

    public PublicacionImagen(Long id, Publicacion publicacion, String url, Short orden) {
        this.id = id;
        this.publicacion = publicacion;
        this.url = url;
        this.orden = orden;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Publicacion getPublicacion() {
        return publicacion;
    }

    public void setPublicacion(Publicacion publicacion) {
        this.publicacion = publicacion;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Short getOrden() {
        return orden;
    }

    public void setOrden(Short orden) {
        this.orden = orden;
    }

    @PrePersist
    protected void onCreate() {
        if (this.orden == null) this.orden = 0;
    }
}
