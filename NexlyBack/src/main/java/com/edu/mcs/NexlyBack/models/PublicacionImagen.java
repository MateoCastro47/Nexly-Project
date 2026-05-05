package com.edu.mcs.NexlyBack.models;

import com.edu.mcs.NexlyBack.models.Enums.TipoMedia;
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoMedia tipo = TipoMedia.IMAGEN;

    @Column(nullable = false)
    private Short orden = 0;

    public PublicacionImagen() {
    }

    public PublicacionImagen(Long id, Publicacion publicacion, String url, TipoMedia tipo, Short orden) {
        this.id = id;
        this.publicacion = publicacion;
        this.url = url;
        this.tipo = tipo;
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

    public TipoMedia getTipo() {
        return tipo;
    }

    public void setTipo(TipoMedia tipo) {
        this.tipo = tipo;
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
        if (this.tipo == null) this.tipo = TipoMedia.IMAGEN;
    }
}
