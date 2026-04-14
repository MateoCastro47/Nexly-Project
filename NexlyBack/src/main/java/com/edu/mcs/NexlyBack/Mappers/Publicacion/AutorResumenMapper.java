package com.edu.mcs.NexlyBack.Mappers.Publicacion;

import org.mapstruct.Mapper;

import com.edu.mcs.NexlyBack.DTOs.Publicacion.AutorResumenDTO;
import com.edu.mcs.NexlyBack.models.Usuario;

@Mapper(componentModel = "spring")
public interface AutorResumenMapper {
    AutorResumenDTO toDTO(Usuario usuario);
}
