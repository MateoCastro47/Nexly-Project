package com.edu.mcs.NexlyBack.Controllers.Auth;

import com.edu.mcs.NexlyBack.DTOs.Auth.LoginRequest;
import com.edu.mcs.NexlyBack.DTOs.Auth.RegisterRequest;
import com.edu.mcs.NexlyBack.DTOs.Usuario.UsuarioDTO;
import com.edu.mcs.NexlyBack.Security.JwtUtil;
import com.edu.mcs.NexlyBack.Services.Usuario.UsuarioService;

import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuariosService;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    public AuthController(UsuarioService usuariosService, AuthenticationManager authManager, JwtUtil jwtUtil) {
        this.usuariosService = usuariosService;
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<UsuarioDTO> register(@Valid @RequestBody RegisterRequest req) {
        UsuarioDTO usuario = usuariosService.registrar(req);
        return ResponseEntity.status(201)
                .header(HttpHeaders.SET_COOKIE, buildTokenCookie(jwtUtil.generate(usuario.getId(), "USER")).toString())
                .body(usuario);
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioDTO> login(@Valid @RequestBody LoginRequest req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.contrasenha())
        );
        Long userId = Long.parseLong(auth.getName());
        String rol = auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        UsuarioDTO usuario = usuariosService.getPerfil(userId, userId);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, buildTokenCookie(jwtUtil.generate(userId, rol)).toString())
                .body(usuario);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie cookie = ResponseCookie.from("nexly_token", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }

    private ResponseCookie buildTokenCookie(String token) {
        return ResponseCookie.from("nexly_token", token)
                .httpOnly(true)
                .secure(false) // cambiar a true en producción (HTTPS)
                .sameSite("Strict")
                .path("/")
                .maxAge(Duration.ofDays(1))
                .build();
    }
}
