package com.edu.mcs.NexlyBack.Controllers.Notificacion;

import com.edu.mcs.NexlyBack.DTOs.Notificacion.NotificacionDTO;
import com.edu.mcs.NexlyBack.Services.Notificacion.NotificacionService;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    private final NotificacionService notificacionService;

    public NotificacionController(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }

    @GetMapping
    public ResponseEntity<Page<NotificacionDTO>> getMias(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication auth) {
        return ResponseEntity.ok(notificacionService.getMisNotificaciones(userId(auth), page, size));
    }

    @GetMapping("/no-leidas/count")
    public ResponseEntity<Map<String, Long>> contarNoLeidas(Authentication auth) {
        return ResponseEntity.ok(Map.of("count", notificacionService.contarNoLeidas(userId(auth))));
    }

    @PutMapping("/leer-todas")
    public ResponseEntity<Void> marcarTodasLeidas(Authentication auth) {
        notificacionService.marcarTodasLeidas(userId(auth));
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/leer")
    public ResponseEntity<Void> marcarLeida(@PathVariable Long id, Authentication auth) {
        notificacionService.marcarLeida(id, userId(auth));
        return ResponseEntity.noContent().build();
    }

    private Long userId(Authentication auth) { return (Long) auth.getPrincipal(); }
}
