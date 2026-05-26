package com.edu.mcs.NexlyBack.DTOs.WebPush;

import jakarta.validation.constraints.NotBlank;

public record PushSubscriptionDTO(
        @NotBlank String endpoint,
        @NotBlank String p256dh,
        @NotBlank String auth
) {}
