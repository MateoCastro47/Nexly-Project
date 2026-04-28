package com.edu.mcs.NexlyBack.Controllers;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.edu.mcs.NexlyBack.DTOs.Mensaje.ConversacionDTO;
import com.edu.mcs.NexlyBack.DTOs.Mensaje.CrearGrupoRequest;
import com.edu.mcs.NexlyBack.DTOs.Mensaje.EnviarMensajeRequest;
import com.edu.mcs.NexlyBack.DTOs.Mensaje.MensajeDTO;
import com.edu.mcs.NexlyBack.Services.MensajeService;

import jakarta.validation.Valid;

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
    public ResponseEntity<Page<MensajeDTO>> getMensajes(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size,
            Authentication auth) {
        return ResponseEntity.ok(mensajeService.getMensajes(id, userId(auth), page, size));
    }

    @PostMapping("/directa/{otroId}")
    public ResponseEntity<ConversacionDTO> iniciarDirecta(@PathVariable Long otroId, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mensajeService.iniciarDirecta(userId(auth), otroId));
    }

    @PostMapping("/conversaciones/{id}")
    public ResponseEntity<MensajeDTO> enviar(@PathVariable Long id,
                                            @RequestBody @Valid EnviarMensajeRequest req,
                                            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mensajeService.enviar(id, userId(auth), req.contenido()));
    }

    @PostMapping("/conversaciones/{id}/leer")
    public ResponseEntity<Void> marcarLeidos(@PathVariable Long id, Authentication auth){
        mensajeService.marcarLeidos(id, userId(auth));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/grupo")
    public ResponseEntity<ConversacionDTO> crearGrupo(
        @RequestBody @Valid CrearGrupoRequest req,
        Authentication auth
    ){
        return ResponseEntity.status(HttpStatus.CREATED).body(mensajeService.crearGrupo(userId(auth), req.nombre(), req.participanteIds()));
    }
    
    
    private Long userId(Authentication auth) { return (Long) auth.getPrincipal(); }
}
