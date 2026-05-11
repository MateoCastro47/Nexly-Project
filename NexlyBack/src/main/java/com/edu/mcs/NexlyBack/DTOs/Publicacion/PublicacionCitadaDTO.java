package com.edu.mcs.NexlyBack.DTOs.Publicacion;

import java.time.LocalDateTime;
import java.util.List;

public class PublicacionCitadaDTO {
    private Long id;
    private String contenido;
    private AutorResumenDTO autor;
    private List<String> imagenes;
    private LocalDateTime fechaCreacion;

    public PublicacionCitadaDTO(Long id, String contenido, AutorResumenDTO autor,
                                 List<String> imagenes, LocalDateTime fechaCreacion) {
        this.id = id;
        this.contenido = contenido;
        this.autor = autor;
        this.imagenes = imagenes;
        this.fechaCreacion = fechaCreacion;
    }

    public Long getId() { return id; }
    public String getContenido() { return contenido; }
    public AutorResumenDTO getAutor() { return autor; }
    public List<String> getImagenes() { return imagenes; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
}
