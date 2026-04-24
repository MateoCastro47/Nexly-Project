package com.edu.mcs.NexlyBack.DTOs.Auth;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record RegisterRequest(
    @NotBlank @Size(max = 100) String nombreCompleto,
    @NotBlank @Size(max = 50)  String nombreUsuario,
    @Email    @NotBlank        String email,
    @NotBlank @Size(min = 8)   String contrasena,
    @NotNull  @Past            LocalDate fechaNacimiento
) {}