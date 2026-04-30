package com.edu.mcs.NexlyBack.Mappers.Notificacion;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.edu.mcs.NexlyBack.DTOs.Notificacion.NotificacionDTO;
import com.edu.mcs.NexlyBack.models.Notificacion;

@Mapper(componentModel = "spring")
public interface NotificacionMapper {

    @Mapping(target = "emisorId", source = "emisor.id")
    @Mapping(target = "emisorUsername", source = "emisor.nombreUsuario")
    @Mapping(target = "emisorFotoPerfil", source = "emisor.fotoPerfil")
    NotificacionDTO tNotificacionDTO(Notificacion n);
}
