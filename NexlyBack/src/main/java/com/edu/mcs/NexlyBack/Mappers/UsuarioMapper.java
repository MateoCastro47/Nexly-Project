package com.edu.mcs.NexlyBack.Mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.edu.mcs.NexlyBack.DTOs.UsuarioDTO;
import com.edu.mcs.NexlyBack.models.Usuario;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    @Mapping(target = "seguidores",    expression = "java(seguidores)")
    @Mapping(target = "seguidos",      expression = "java(seguidos)")
    @Mapping(target = "publicaciones", expression = "java(publicaciones)")
    @Mapping(target = "teSigue",       expression = "java(teSigue)")
    @Mapping(target = "loSigues",      expression = "java(loSigues)")
    @Mapping(target = "estaBloqueado", expression = "java(estaBloqueado)")
    @Mapping(target = "teBloqueo",     expression = "java(teBloqueo)")
    UsuarioDTO toDTO(Usuario usuario, long seguidores, long seguidos, long publicaciones, boolean teSigue, boolean loSigues, boolean estaBloqueado, boolean teBloqueo);
}