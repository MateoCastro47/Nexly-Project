package com.edu.mcs.NexlyBack.DTOs.Auth;

import jakarta.validation.constraints.NotBlank;

public record VerificarRequest(
    @NotBlank String token
) {}
