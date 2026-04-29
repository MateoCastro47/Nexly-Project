package com.edu.mcs.NexlyBack.Controllers.Auth;

import com.edu.mcs.NexlyBack.DTOs.Auth.AuthResponse;
import com.edu.mcs.NexlyBack.DTOs.Auth.LoginRequest;
import com.edu.mcs.NexlyBack.DTOs.Auth.RegisterRequest;
import com.edu.mcs.NexlyBack.DTOs.Usuario.UsuarioDTO;
import com.edu.mcs.NexlyBack.Security.JwtUtil;
import com.edu.mcs.NexlyBack.Services.Usuario.UsuarioService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        
        UsuarioDTO usuario = usuariosService.registrar(req);
        String token = jwtUtil.generate(usuario.getId(), "USER");
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(token, usuario));

    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.email(), req.contrasenha())
        );
        Long userId = Long.parseLong(auth.getName());
        String rol = auth.getAuthorities().iterator().next()
                         .getAuthority().replace("ROLE_", "");
        UsuarioDTO usuario = usuariosService.getPerfil(userId, userId);
        return ResponseEntity.ok(new AuthResponse(jwtUtil.generate(userId, rol), usuario));
    }
    
}
