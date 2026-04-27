package com.edu.mcs.NexlyBack.Mappers.Comunidad;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.edu.mcs.NexlyBack.DTOs.Comunidad.ComunidadDTO;
import com.edu.mcs.NexlyBack.DTOs.Publicacion.AutorResumenDTO;
import com.edu.mcs.NexlyBack.models.Comunidad;

@Mapper(componentModel = "spring")
public interface ComunidadMapper {
    
    @Mapping(target = "id",          source = "comunidad.id")
    @Mapping(target = "nombre",      source = "comunidad.nombre")
    @Mapping(target = "descripcion", source = "comunidad.descripcion")
    @Mapping(target = "reglas",      source = "comunidad.reglas")
    @Mapping(target = "foto",        source = "comunidad.foto")
    @Mapping(target = "esPublica",   source = "comunidad.esPublica")
    @Mapping(target = "creador",     source = "creador")
    @Mapping(target = "categoria",   source = "categoria")
    @Mapping(target = "totalMiembros", source = "totalMiembros")
    @Mapping(target = "esMiembro",   source = "esMiembro")
    @Mapping(target = "esCreador",   source = "esCreador")
    ComunidadDTO toDTO(Comunidad comunidad, AutorResumenDTO creador, String categoria, long totalMiembros, boolean esMiembro, boolean esCreador);

}
