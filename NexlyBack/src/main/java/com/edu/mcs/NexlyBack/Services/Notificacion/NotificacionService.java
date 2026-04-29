package com.edu.mcs.NexlyBack.Services.Notificacion;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.edu.mcs.NexlyBack.DTOs.Notificacion.NotificacionDTO;
import com.edu.mcs.NexlyBack.Mappers.Notificacion.NotificacionMapper;
import com.edu.mcs.NexlyBack.Repositories.Notificacion.NotificacionRepository;
import com.edu.mcs.NexlyBack.Repositories.Usuario.UsuarioRepository;
import com.edu.mcs.NexlyBack.models.Notificacion;
import com.edu.mcs.NexlyBack.models.Usuario;
import com.edu.mcs.NexlyBack.models.Enums.TipoNotificacion;

@Service
@Transactional(readOnly = true)
public class NotificacionService {
    
    private final NotificacionRepository notificacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final NotificacionMapper notificacionMapper;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificacionService(NotificacionRepository notificacionRepository, UsuarioRepository usuarioRepository,
            NotificacionMapper notificacionMapper, SimpMessagingTemplate messagingTemplate) {
        this.notificacionRepository = notificacionRepository;
        this.usuarioRepository = usuarioRepository;
        this.notificacionMapper = notificacionMapper;
        this.messagingTemplate = messagingTemplate;
    }

    public Page<NotificacionDTO> getMisNotificaciones(Long userId, int page, int size){
        return notificacionRepository.findByDestinatarioIdOrderByFechaCreacionDesc(userId, PageRequest.of(page, size)).map(notificacionMapper::tNotificacionDTO);
    }

    public long contarNoLeidas(Long userId){
        return notificacionRepository.countByDestinatarioIdAndLeidaFalse(userId);
    }

    @Transactional
    public void marcarTodasLeidas(Long userId){
        notificacionRepository.marcarTodasLeidas(userId);
    }

    @Transactional
    public void marcarLeida(Long notificacionId, Long userId){
        notificacionRepository.findById(notificacionId).ifPresent(n -> {
            if (n.getDestinatario().getId().equals(userId)) {
                n.setLeida(true);
            }
        });
    }
    
     // Llamado desde otros services — no lanza excepción si el destinatario no existe
    @Transactional
    public void emitir(Long destinatarioId, Long emisorId, TipoNotificacion tipo, Long entidadId) {
        if (destinatarioId.equals(emisorId)) return; // no auto-notificar

        Usuario destinatario = usuarioRepository.findById(destinatarioId).orElse(null);
        if (destinatario == null) return;

        Usuario emisor = emisorId != null
                ? usuarioRepository.getReferenceById(emisorId)
                : null;

        Notificacion n = new Notificacion(destinatario, emisor, tipo, entidadId);
        NotificacionDTO dto = notificacionMapper.tNotificacionDTO(notificacionRepository.save(n));

        // broadcast WebSocket al destinatario
        messagingTemplate.convertAndSendToUser(
                destinatario.getNombreUsuario(),
                "/queue/notificaciones",
                dto
        );
    }
}
