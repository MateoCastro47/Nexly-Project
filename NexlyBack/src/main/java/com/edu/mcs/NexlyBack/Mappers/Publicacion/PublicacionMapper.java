package com.edu.mcs.NexlyBack.Mappers.Publicacion;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.edu.mcs.NexlyBack.DTOs.Publicacion.AutorResumenDTO;
import com.edu.mcs.NexlyBack.DTOs.Publicacion.MediaDTO;
import com.edu.mcs.NexlyBack.DTOs.Publicacion.PublicacionCitadaDTO;
import com.edu.mcs.NexlyBack.DTOs.Publicacion.PublicacionDTO;
import com.edu.mcs.NexlyBack.models.Enums.TipoReaccion;
import com.edu.mcs.NexlyBack.models.Publicacion;

@Mapper(componentModel = "spring")
public interface PublicacionMapper {

    @Mapping(target = "id",               source = "publicacion.id")
    @Mapping(target = "contenido",        source = "publicacion.contenido")
    @Mapping(target = "visibilidad",      source = "publicacion.visibilidad")
    @Mapping(target = "fechaCreacion",    source = "publicacion.fechaCreacion")
    @Mapping(target = "fechaEdicion",     source = "publicacion.fechaEdicion")
    @Mapping(target = "fijada",           source = "publicacion.fijada")
    @Mapping(target = "comentariosActivos", source = "publicacion.comentariosActivos")
    @Mapping(target = "comunidadId",        source = "publicacion.comunidad.id")
    @Mapping(target = "publicacionCitada",  expression = "java(publicacionCitada)")
    @Mapping(target = "autor",              expression = "java(autor)")
    @Mapping(target = "imagenes",           expression = "java(imagenes)")
    @Mapping(target = "media",              expression = "java(media)")
    @Mapping(target = "conteoReacciones",   expression = "java(conteoReacciones)")
    @Mapping(target = "conteoComentarios",  expression = "java(conteoComentarios)")
    @Mapping(target = "reaccionDelVisor",   expression = "java(reaccionDelVisor)")
    @Mapping(target = "tipoPost",           source = "publicacion.tipoPost")
    PublicacionDTO toDTO(Publicacion publicacion, AutorResumenDTO autor, List<String> imagenes, List<MediaDTO> media,
                         long conteoReacciones, long conteoComentarios, TipoReaccion reaccionDelVisor,
                         PublicacionCitadaDTO publicacionCitada);
}