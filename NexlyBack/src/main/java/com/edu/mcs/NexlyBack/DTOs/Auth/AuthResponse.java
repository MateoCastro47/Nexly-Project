package com.edu.mcs.NexlyBack.DTOs.Auth;

import com.edu.mcs.NexlyBack.DTOs.Usuario.UsuarioDTO;

public record AuthResponse(String token, UsuarioDTO usuario) {}
