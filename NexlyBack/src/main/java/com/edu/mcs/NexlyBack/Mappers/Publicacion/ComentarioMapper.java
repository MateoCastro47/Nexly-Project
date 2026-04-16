package com.edu.mcs.NexlyBack.Mappers.Publicacion;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.edu.mcs.NexlyBack.DTOs.Publicacion.AutorResumenDTO;
import com.edu.mcs.NexlyBack.DTOs.Publicacion.ComentarioDTO;
import com.edu.mcs.NexlyBack.models.Comentario;
import com.edu.mcs.NexlyBack.models.Enums.TipoReaccion;

@Mapper(componentModel = "spring")
public interface ComentarioMapper {

    @Mapping(target = "id",               source = "comentario.id")
    @Mapping(target = "contenido",        source = "comentario.contenido")
    @Mapping(target = "fechaCreacion",    source = "comentario.fechaCreacion")
    @Mapping(target = "fechaEdicion",     source = "comentario.fechaEdicion")
    @Mapping(target = "publicacionId",    source = "comentario.publicacion.id")
    @Mapping(target = "comentarioPadreId",source = "comentario.comentarioPadre.id")
    @Mapping(target = "autor",            expression = "java(autor)")
    @Mapping(target = "conteoRespuestas", expression = "java(conteoRespuestas)")
    @Mapping(target = "conteoReacciones", expression = "java(conteoReacciones)")
    @Mapping(target = "reaccion", expression = "java(reaccionDelVisor)")
    ComentarioDTO toDTO(Comentario comentario, AutorResumenDTO autor,
                        long conteoRespuestas, long conteoReacciones, TipoReaccion reaccionDelVisor);
}