package com.edu.mcs.NexlyBack.Mappers.Notificacion;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.edu.mcs.NexlyBack.DTOs.Notificacion.NotificacionDTO;
import com.edu.mcs.NexlyBack.models.Notificacion;
import com.edu.mcs.NexlyBack.models.Usuario;

@Mapper(componentModel = "spring")
public interface NotificacionMapper {
    
    @Mapping(target = "leida", source = "leida")
    @Mapping(target = "emisorId", expression = "java(emisorId(n))")
    @Mapping(target = "emisorUsername", expression = "java(emisorUsername(n))")
    @Mapping(target = "emisorFotoPerfil", expression = "java(emisorFotoPerfil(n))")
    NotificacionDTO tNotificacionDTO(Notificacion notificacion);

    default Long emisorId(Notificacion n){
        Usuario e = n.getEmisor();
        return e != null ? e.getId() : null;
    }

    default String emisorUsername(Notificacion n){
        Usuario e = n.getEmisor();
        return e != null ? e.getNombreUsuario() : null;
    }

    default String emisorFotoPerfil(Notificacion n){
        Usuario e = n.getEmisor();
        return e != null ? e.getFotoPerfil() : null;
    }
}
