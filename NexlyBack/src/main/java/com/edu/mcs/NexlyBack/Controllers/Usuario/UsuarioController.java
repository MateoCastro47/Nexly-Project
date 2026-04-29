package com.edu.mcs.NexlyBack.Controllers.Usuario;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edu.mcs.NexlyBack.DTOs.Usuario.ActualizarPerfilRequest;
import com.edu.mcs.NexlyBack.DTOs.Usuario.UsuarioDTO;
import com.edu.mcs.NexlyBack.Services.Usuario.UsuarioService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {
    
    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService){
        this.usuarioService = usuarioService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> getPerfil(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(usuarioService.getPerfil(id, userId(auth)));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UsuarioDTO> getPerfilPorUsername(@PathVariable String username, Authentication auth) {
        return ResponseEntity.ok(usuarioService.getPerfilPorUsername(username, userId(auth)));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<UsuarioDTO>> buscar(@RequestParam String q, Authentication auth) {
        return ResponseEntity.ok(usuarioService.buscar(q, userId(auth)));
    }
    
     @PutMapping("/perfil")
    public ResponseEntity<UsuarioDTO> actualizarPerfil(@Valid @RequestBody ActualizarPerfilRequest req,
                                                        Authentication auth) {
        return ResponseEntity.ok(usuarioService.actualizarPerfil(userId(auth), req));
    }

    @PostMapping("/{id}/seguir")
    public ResponseEntity<Void> seguir(@PathVariable Long id, Authentication auth) {
        usuarioService.seguir(userId(auth), id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/seguir")
    public ResponseEntity<Void> dejarDeSeguir(@PathVariable Long id, Authentication auth) {
        usuarioService.dejarDeSeguir(userId(auth), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/bloquear")
    public ResponseEntity<Void> bloquear(@PathVariable Long id, Authentication auth) {
        usuarioService.bloquear(userId(auth), id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/bloquear")
    public ResponseEntity<Void> desbloquear(@PathVariable Long id, Authentication auth) {
        usuarioService.desbloquear(userId(auth), id);
        return ResponseEntity.noContent().build();
    }

    private Long userId(Authentication auth) { return (Long) auth.getPrincipal(); }
}
