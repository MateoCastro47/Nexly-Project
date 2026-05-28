package com.edu.mcs.NexlyBack.DTOs.Auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ReenviarRequest(
    @Email @NotBlank String email
) {}
