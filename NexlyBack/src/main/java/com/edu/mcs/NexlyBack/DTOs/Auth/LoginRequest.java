package com.edu.mcs.NexlyBack.DTOs.Auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest( 
    @Email @NotBlank String email,
    @NotBlank String contrasenha
){}
