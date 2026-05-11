package com.edu.mcs.NexlyBack.DTOs.Publicacion;

import java.time.LocalDateTime;
import java.util.List;

import com.edu.mcs.NexlyBack.models.Enums.TipoPost;
import com.edu.mcs.NexlyBack.models.Enums.TipoReaccion;
import com.edu.mcs.NexlyBack.models.Enums.Visibilidad;

public class PublicacionDTO {
    private Long id;
    private AutorResumenDTO autor;
    private Long comunidadId;
    private PublicacionCitadaDTO publicacionCitada;
    private String contenido;
    private Visibilidad visibilidad;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaEdicion;
    private boolean fijada;
    private boolean comentariosActivos;
    private List<String> imagenes;
    private List<MediaDTO> media;
    private long conteoReacciones;
    private long conteoComentarios;
    private TipoReaccion reaccionDelVisor;
    private TipoPost tipoPost;


    public PublicacionDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AutorResumenDTO getAutor() {
        return autor;
    }

    public void setAutor(AutorResumenDTO autor) {
        this.autor = autor;
    }

    public Long getComunidadId() {
        return comunidadId;
    }

    public void setComunidadId(Long comunidadId) {
        this.comunidadId = comunidadId;
    }

    public PublicacionCitadaDTO getPublicacionCitada() {
        return publicacionCitada;
    }

    public void setPublicacionCitada(PublicacionCitadaDTO publicacionCitada) {
        this.publicacionCitada = publicacionCitada;
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

    public boolean isFijada() {
        return fijada;
    }

    public void setFijada(boolean fijada) {
        this.fijada = fijada;
    }

    public boolean isComentariosActivos() {
        return comentariosActivos;
    }

    public void setComentariosActivos(boolean comentariosActivos) {
        this.comentariosActivos = comentariosActivos;
    }

    public List<String> getImagenes() {
        return imagenes;
    }

    public void setImagenes(List<String> imagenes) {
        this.imagenes = imagenes;
    }

    public List<MediaDTO> getMedia() {
        return media;
    }

    public void setMedia(List<MediaDTO> media) {
        this.media = media;
    }

    public long getConteoReacciones() {
        return conteoReacciones;
    }

    public void setConteoReacciones(long conteoReacciones) {
        this.conteoReacciones = conteoReacciones;
    }

    public long getConteoComentarios() {
        return conteoComentarios;
    }

    public void setConteoComentarios(long conteoComentarios) {
        this.conteoComentarios = conteoComentarios;
    }

    public TipoReaccion getReaccionDelVisor() {
        return reaccionDelVisor;
    }

    public void setReaccionDelVisor(TipoReaccion reaccionDelVisor) {
        this.reaccionDelVisor = reaccionDelVisor;
    }

    public TipoPost getTipoPost() {
        return tipoPost;
    }

    public void setTipoPost(TipoPost tipoPost) {
        this.tipoPost = tipoPost;
    }


}
