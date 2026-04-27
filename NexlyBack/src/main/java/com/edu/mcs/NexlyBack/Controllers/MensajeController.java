package com.edu.mcs.NexlyBack.Controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.edu.mcs.NexlyBack.DTOs.Mensaje.ConversacionDTO;
import com.edu.mcs.NexlyBack.DTOs.Mensaje.MensajeDTO;
import com.edu.mcs.NexlyBack.Services.MensajeService;

import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("/api/mensajes")
public class MensajeController {

    private final MensajeService mensajeService;

    public MensajeController(MensajeService mensajeService) {
        this.mensajeService = mensajeService;
    }

    @GetMapping("/conversaciones")
    public ResponseEntity<List<ConversacionDTO>> getMisConversaciones(Authentication auth) {
        return ResponseEntity.ok(mensajeService.getMisConversaciones(userId(auth)));
    }

    @GetMapping("/conversaciones/{id}")
    public ResponseEntity<List<MensajeDTO>> getMensajes(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(mensajeService.getMensajes(id, userId(auth)));
    }

    @PostMapping("/directa/{otroId}")
    public ResponseEntity<ConversacionDTO> iniciarDirecta(@PathVariable Long otroId, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mensajeService.iniciarDirecta(userId(auth), otroId));
    }

    @PostMapping("/conversaciones/{id}")
    public ResponseEntity<MensajeDTO> enviar(@PathVariable Long id,
                                             @RequestParam @NotBlank String contenido,
                                             Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mensajeService.enviar(id, userId(auth), contenido));
    }

    private Long userId(Authentication auth) { return (Long) auth.getPrincipal(); }
}
