package com.edu.mcs.NexlyBack.DTOs.Publicacion;

import java.time.LocalDateTime;

import com.edu.mcs.NexlyBack.models.Enums.TipoReaccion;

public class ComentarioDTO {
    private Long id;
    private AutorResumenDTO autor;
    private Long publicacionId;
    private Long comentarioPadreId;
    private String contenido;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaEdicion;
    private Long conteoRespuestas;
    private Long conteoReacciones;
    private TipoReaccion reaccion;

    public ComentarioDTO() {
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

    public Long getPublicacionId() {
        return publicacionId;
    }

    public void setPublicacionId(Long publicacionId) {
        this.publicacionId = publicacionId;
    }

    public Long getComentarioPadreId() {
        return comentarioPadreId;
    }

    public void setComentarioPadreId(Long comentarioPadreId) {
        this.comentarioPadreId = comentarioPadreId;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
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

    public Long getConteoRespuestas() {
        return conteoRespuestas;
    }

    public void setConteoRespuestas(Long conteoRespuestas) {
        this.conteoRespuestas = conteoRespuestas;
    }

    public Long getConteoReacciones() {
        return conteoReacciones;
    }

    public void setConteoReacciones(Long conteoReacciones) {
        this.conteoReacciones = conteoReacciones;
    }

    public TipoReaccion getReaccion() {
        return reaccion;
    }

    public void setReaccion(TipoReaccion reaccion) {
        this.reaccion = reaccion;
    }


}
