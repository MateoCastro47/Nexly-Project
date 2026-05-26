package com.edu.mcs.NexlyBack.Services.WebPush;

import java.security.Security;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.annotation.PostConstruct;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.edu.mcs.NexlyBack.DTOs.WebPush.PushSubscriptionDTO;
import com.edu.mcs.NexlyBack.Repositories.Usuario.UsuarioRepository;
import com.edu.mcs.NexlyBack.Repositories.WebPush.WebPushSubscriptionRepository;
import com.edu.mcs.NexlyBack.models.Usuario;
import com.edu.mcs.NexlyBack.models.WebPushSubscriptions;
import com.fasterxml.jackson.databind.ObjectMapper;

import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;

@Service
public class WebPushService {

    private static final Logger log = LoggerFactory.getLogger(WebPushService.class);

    private final WebPushSubscriptionRepository repo;
    private final UsuarioRepository usuarioRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${app.push.vapid.public-key}")
    private String publicKey;

    @Value("${app.push.vapid.private-key}")
    private String privateKey;

    @Value("${app.push.vapid.subject}")
    private String subject;

    private PushService pushService;

    public WebPushService(WebPushSubscriptionRepository repo, UsuarioRepository usuarioRepository) {
        this.repo = repo;
        this.usuarioRepository = usuarioRepository;
    }

    @PostConstruct
    public void init() {
        if (publicKey == null || publicKey.isBlank()
                || privateKey == null || privateKey.isBlank()) {
            log.warn("Web Push deshabilitado: faltan las claves VAPID (VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY).");
            return;
        }
        try {
            if (Security.getProvider("BC") == null) {
                Security.addProvider(new BouncyCastleProvider());
            }
            this.pushService = new PushService(publicKey, privateKey, subject);
        } catch (Exception e) {
            log.error("No se pudo inicializar el Web Push; quedara deshabilitado.", e);
            this.pushService = null;
        }
    }

    /** ¿Está el push operativo? (claves VAPID presentes y servicio inicializado). */
    public boolean estaHabilitado() {
        return pushService != null;
    }

    public String getPublicKey() {
        return publicKey;
    }

    @Transactional
    public void subscribe(Long userId, PushSubscriptionDTO dto, String userAgent) {
        // Si el endpoint ya existe (mismo navegador), lo reemplazamos para no duplicar.
        repo.findByEndpoint(dto.endpoint()).ifPresent(repo::delete);

        Usuario u = usuarioRepository.getReferenceById(userId);
        WebPushSubscriptions s = new WebPushSubscriptions();
        s.setUsuario(u);
        s.setEndpoint(dto.endpoint());
        s.setP256dh(dto.p256dh());
        s.setAuth(dto.auth());
        s.setUserAgent(userAgent);
        repo.save(s);
    }

    @Transactional
    public void unsubscribe(String endpoint) {
        repo.deleteByEndpoint(endpoint);
    }

    /**
     * Envía una notificación push a todas las suscripciones del usuario.
     * Asíncrono para no bloquear la creación de la notificación / el WebSocket.
     * Las suscripciones muertas (404/410) se borran automáticamente.
     */
    @Async
    @Transactional
    public void enviar(Long userId, String titulo, String cuerpo, String url) {
        if (!estaHabilitado()) return; // sin claves VAPID, no hay push

        List<WebPushSubscriptions> subs = repo.findByUsuarioId(userId);
        if (subs.isEmpty()) return;

        String payload;
        try {
            Map<String, String> body = new HashMap<>();
            body.put("title", titulo);
            body.put("body", cuerpo);
            if (url != null) body.put("url", url);
            payload = mapper.writeValueAsString(body);
        } catch (Exception e) {
            log.warn("No se pudo serializar el payload push", e);
            return;
        }

        for (WebPushSubscriptions s : subs) {
            try {
                Notification n = new Notification(
                        s.getEndpoint(), s.getP256dh(), s.getAuth(), payload.getBytes());
                var resp = pushService.send(n);
                int code = resp.getStatusLine().getStatusCode();
                if (code == 404 || code == 410) {
                    repo.delete(s);
                } else if (code >= 400) {
                    log.warn("Push respondio {} para endpoint {}", code, s.getEndpoint());
                }
            } catch (Exception e) {
                log.warn("Fallo enviando push a {}: {}", s.getEndpoint(), e.getMessage());
            }
        }
    }
}
