package com.edu.mcs.NexlyBack.Controllers.WebPush;

import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.edu.mcs.NexlyBack.DTOs.WebPush.PushSubscriptionDTO;
import com.edu.mcs.NexlyBack.Services.WebPush.WebPushService;

@RestController
@RequestMapping("/api/push")
public class WebPushController {

    private final WebPushService webPushService;

    public WebPushController(WebPushService webPushService) {
        this.webPushService = webPushService;
    }

    @GetMapping("/public-key")
    public ResponseEntity<Map<String, String>> publicKey() {
        return ResponseEntity.ok(Map.of("publicKey", webPushService.getPublicKey()));
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Void> subscribe(@Valid @RequestBody PushSubscriptionDTO dto,
                                          HttpServletRequest req,
                                          Authentication auth) {
        webPushService.subscribe(userId(auth), dto, req.getHeader("User-Agent"));
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/subscribe")
    public ResponseEntity<Void> unsubscribe(@RequestParam String endpoint) {
        webPushService.unsubscribe(endpoint);
        return ResponseEntity.noContent().build();
    }

    private Long userId(Authentication auth) { return (Long) auth.getPrincipal(); }
}
