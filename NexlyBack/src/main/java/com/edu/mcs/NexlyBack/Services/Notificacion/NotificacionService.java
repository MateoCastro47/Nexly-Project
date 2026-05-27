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
import com.edu.mcs.NexlyBack.Services.WebPush.WebPushService;
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
    private final WebPushService webPushService;

    public NotificacionService(NotificacionRepository notificacionRepository, UsuarioRepository usuarioRepository,
            NotificacionMapper notificacionMapper, SimpMessagingTemplate messagingTemplate,
            WebPushService webPushService) {
        this.notificacionRepository = notificacionRepository;
        this.usuarioRepository = usuarioRepository;
        this.notificacionMapper = notificacionMapper;
        this.messagingTemplate = messagingTemplate;
        this.webPushService = webPushService;
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

        // broadcast WebSocket al destinatario.
        // El Principal del WS se identifica por userId (ver JwtHandShakeInterceptor),
        // así que hay que enviar por id, no por nombreUsuario (igual que el chat).
        messagingTemplate.convertAndSendToUser(
                String.valueOf(destinatarioId),
                "/queue/notificaciones",
                dto
        );

        // push del navegador (asíncrono, no bloquea)
        String nombreEmisor = emisor != null ? emisor.getNombreUsuario() : "Alguien";
        webPushService.enviar(
                destinatarioId,
                tituloPara(tipo, nombreEmisor),
                cuerpoPara(tipo, nombreEmisor),
                urlPara(tipo, entidadId, nombreEmisor)
        );
    }

    private String tituloPara(TipoNotificacion tipo, String emisor) {
        return switch (tipo) {
            case NUEVO_SEGUIDOR              -> "Nuevo seguidor";
            case NUEVA_REACCION_PUBLICACION  -> "Nueva reaccion";
            case NUEVO_COMENTARIO            -> "Nuevo comentario";
            case NUEVA_REACCION_COMENTARIO   -> "Nueva reaccion en tu comentario";
            case NUEVO_MENSAJE               -> "Mensaje de " + emisor;
        };
    }

    private String cuerpoPara(TipoNotificacion tipo, String emisor) {
        return switch (tipo) {
            case NUEVO_SEGUIDOR              -> "@" + emisor + " empezo a seguirte";
            case NUEVA_REACCION_PUBLICACION  -> "@" + emisor + " reacciono a tu publicacion";
            case NUEVO_COMENTARIO            -> "@" + emisor + " comento tu publicacion";
            case NUEVA_REACCION_COMENTARIO   -> "@" + emisor + " reacciono a tu comentario";
            case NUEVO_MENSAJE               -> "Tienes un mensaje nuevo";
        };
    }

    // Rutas reales del front (Router.tsx): no hay página de post individual,
    // y el chat no recibe id por URL. Caemos en /notificaciones o /chat.
    private String urlPara(TipoNotificacion tipo, Long entidadId, String emisor) {
        return switch (tipo) {
            case NUEVO_SEGUIDOR              -> "/perfil/" + emisor;
            case NUEVA_REACCION_PUBLICACION,
                 NUEVO_COMENTARIO,
                 NUEVA_REACCION_COMENTARIO   -> "/notificaciones";
            case NUEVO_MENSAJE               -> "/chat";
        };
    }
}
