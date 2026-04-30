package com.edu.mcs.NexlyBack.WebSocket;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import com.edu.mcs.NexlyBack.DTOs.Mensaje.EnviarMensajeRequest;
import com.edu.mcs.NexlyBack.Services.Mensaje.MensajeService;

import jakarta.validation.Valid;

@Controller
public class ChatController {

    private final MensajeService mensajeService;

    public ChatController(MensajeService mensajeService) {
        this.mensajeService = mensajeService;
    }

    @MessageMapping("/chat/{conversacionId}")
    public void enviarMensaje(
            @DestinationVariable Long conversacionId,
            @Payload @Valid EnviarMensajeRequest req,
            Principal principal) {
        Long userId = (Long) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
        mensajeService.enviar(conversacionId, userId, req.contenido());
    }

    @MessageExceptionHandler
    @SendToUser("/queue/errores")
    public String handleException(Exception ex) {
        return ex.getMessage();
    }
}
