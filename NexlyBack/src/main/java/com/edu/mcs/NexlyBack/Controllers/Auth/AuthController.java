package com.edu.mcs.NexlyBack.Controllers.Auth;

import com.edu.mcs.NexlyBack.DTOs.Auth.LoginRequest;
import com.edu.mcs.NexlyBack.DTOs.Auth.RegisterRequest;
import com.edu.mcs.NexlyBack.DTOs.Auth.ReenviarRequest;
import com.edu.mcs.NexlyBack.DTOs.Auth.VerificarRequest;
import com.edu.mcs.NexlyBack.DTOs.Usuario.UsuarioDTO;
import com.edu.mcs.NexlyBack.Security.JwtUtil;
import com.edu.mcs.NexlyBack.Services.Auth.VerificacionEmailService;
import com.edu.mcs.NexlyBack.Services.Usuario.UsuarioService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuariosService;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final VerificacionEmailService verificacionEmailService;
    private final String cookieName;

    public AuthController(UsuarioService usuariosService, AuthenticationManager authManager, JwtUtil jwtUtil,
                          VerificacionEmailService verificacionEmailService,
                          @Value("${app.auth.cookie-name}") String cookieName) {
        this.usuariosService = usuariosService;
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.verificacionEmailService = verificacionEmailService;
        this.cookieName = cookieName;
    }

    @PostMapping("/register")
    public ResponseEntity<UsuarioDTO> register(@Valid @RequestBody RegisterRequest req) {
        UsuarioDTO usuario = usuariosService.registrar(req);
        // Sin auto-login: el usuario debe confirmar su correo antes de poder iniciar sesión.
        return ResponseEntity.status(201).body(usuario);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.email(), req.contrasenha())
            );
            Long userId = Long.parseLong(auth.getName());
            String rol = auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
            UsuarioDTO usuario = usuariosService.getPerfil(userId, userId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, buildTokenCookie(jwtUtil.generate(userId, rol)).toString())
                    .body(usuario);
        } catch (DisabledException e) {
            // Cuenta sin el email verificado. 403 (no 401) para que el front no redirija a /login.
            return ResponseEntity.status(403).body(Map.of("error", "EMAIL_NO_VERIFICADO"));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/verificar")
    public ResponseEntity<?> verificar(@Valid @RequestBody VerificarRequest req) {
        verificacionEmailService.verificar(req.token());
        return ResponseEntity.ok(Map.of("mensaje", "Cuenta verificada correctamente. Ya puedes iniciar sesión."));
    }

    @PostMapping("/reenviar-verificacion")
    public ResponseEntity<?> reenviar(@Valid @RequestBody ReenviarRequest req) {
        verificacionEmailService.reenviar(req.email());
        return ResponseEntity.ok(Map.of("mensaje", "Te hemos reenviado el correo de verificación."));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie cookie = ResponseCookie.from(cookieName, "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }

    private ResponseCookie buildTokenCookie(String token) {
        return ResponseCookie.from(cookieName, token)
                .httpOnly(true)
                .secure(false) // cambiar a true en producción (HTTPS)
                .sameSite("Strict")
                .path("/")
                .maxAge(Duration.ofDays(1))
                .build();
    }
}
