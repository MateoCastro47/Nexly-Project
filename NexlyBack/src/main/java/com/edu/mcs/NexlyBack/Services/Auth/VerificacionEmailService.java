package com.edu.mcs.NexlyBack.Services.Auth;

import com.edu.mcs.NexlyBack.Repositories.Auth.TokenVerificacionRepository;
import com.edu.mcs.NexlyBack.Repositories.Usuario.UsuarioRepository;
import com.edu.mcs.NexlyBack.models.TokenVerificacion;
import com.edu.mcs.NexlyBack.models.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import java.util.UUID;

/**
 * Orquesta el flujo de verificación de email: genera el token, envía el
 * correo y valida el enlace cuando el usuario lo pulsa.
 */
@Service
public class VerificacionEmailService {

    private static final long EXPIRACION_HORAS = 24;

    private final TokenVerificacionRepository tokenRepository;
    private final UsuarioRepository usuarioRepository;
    private final MailService mailService;
    private final String frontendUrl;

    public VerificacionEmailService(TokenVerificacionRepository tokenRepository,
                                    UsuarioRepository usuarioRepository,
                                    MailService mailService,
                                    @Value("${app.frontend-url}") String frontendUrl) {
        this.tokenRepository = tokenRepository;
        this.usuarioRepository = usuarioRepository;
        this.mailService = mailService;
        this.frontendUrl = frontendUrl;
    }

    /** Crea un token nuevo (invalidando los anteriores del usuario) y envía el correo. */
    @Transactional
    public void crearYEnviar(Usuario usuario) {
        tokenRepository.deleteByUsuarioId(usuario.getId());

        String token = UUID.randomUUID().toString().replace("-", "");
        tokenRepository.save(new TokenVerificacion(
                token, usuario, LocalDateTime.now().plusHours(EXPIRACION_HORAS)));

        String enlace = frontendUrl + "/verificar?token=" + token;
        mailService.enviarVerificacion(usuario.getEmail(), usuario.getNombreCompleto(), enlace);
    }

    /** Valida el token, marca el email como verificado y consume el token. */
    @Transactional
    public void verificar(String token) {
        TokenVerificacion tv = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("El enlace de verificación no es válido"));

        if (tv.estaCaducado()) {
            tokenRepository.delete(tv);
            throw new IllegalArgumentException("El enlace de verificación ha caducado. Solicita uno nuevo.");
        }

        Usuario usuario = tv.getUsuario();
        usuario.setEmailVerificado(true);
        usuarioRepository.save(usuario);
        tokenRepository.delete(tv);
    }

    /** Reenvía el correo de verificación a una cuenta aún sin verificar. */
    @Transactional
    public void reenviar(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("No existe ninguna cuenta con ese correo"));

        if (Boolean.TRUE.equals(usuario.getEmailVerificado())) {
            throw new IllegalArgumentException("Esta cuenta ya está verificada");
        }
        crearYEnviar(usuario);
    }
}
