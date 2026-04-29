package com.edu.mcs.NexlyBack.Controllers.Comunidad;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edu.mcs.NexlyBack.DTOs.Comunidad.ComunidadDTO;
import com.edu.mcs.NexlyBack.DTOs.Comunidad.CrearComunidadRequest;
import com.edu.mcs.NexlyBack.DTOs.Comunidad.MiembroDTO;
import com.edu.mcs.NexlyBack.Services.Comunidad.ComunidadService;
import com.edu.mcs.NexlyBack.models.Enums.RolComunidad;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/comunidades")
public class ComunidadController {
    
    private final ComunidadService comunidadService;

    public ComunidadController(ComunidadService comunidadService) {
        this.comunidadService = comunidadService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComunidadDTO> getComunidad(@PathVariable Long id, Authentication auth){
        return ResponseEntity.ok(comunidadService.getComunidad(id, userId(auth)));
    }

    @GetMapping
    public ResponseEntity<Page<ComunidadDTO>> getPublicas(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "12") int size ,Authentication auth){
        return ResponseEntity.ok(comunidadService.getPublicas(userId(auth), page, size));
    }

    @GetMapping("/buscar")
    public ResponseEntity<Page<ComunidadDTO>> buscar(@RequestParam String q, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "12") int size, Authentication auth){
        return ResponseEntity.ok(comunidadService.buscar(q, userId(auth), page, size));
    }

    @GetMapping("/{id}/miembros")
    public ResponseEntity<Page<MiembroDTO>> getMiembros(
        @PathVariable Long id,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        Authentication auth){
            return ResponseEntity.ok(comunidadService.getMiembros(id, userId(auth), page, size));
    }

    @GetMapping("/{id}/pendientes")
    public ResponseEntity<List<MiembroDTO>> getPendientes(@PathVariable Long id, Authentication auth){
        return ResponseEntity.ok(comunidadService.getPendientes(id, userId(auth)));
    }
    
    @PostMapping("/{id}/miembros/{usuarioId}/aceptar")
    public ResponseEntity<Void> aceptarMiembro(@PathVariable Long id, @PathVariable Long usuarioId, Authentication auth) {
        comunidadService.aceptarMiembro(id, userId(auth), usuarioId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/miembros/{usuarioId}/rechazar")
    public ResponseEntity<Void> rechazarMiembro(@PathVariable Long id, @PathVariable Long usuarioId, Authentication auth) {
        comunidadService.rechazarMiembro(id, userId(auth), usuarioId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/miembros/{usuarioId}/rol")
    public ResponseEntity<Void> cambiarRol(@PathVariable Long id, @PathVariable Long usuarioId,
                                           @RequestParam RolComunidad rol, Authentication auth) {
        comunidadService.cambiarRol(id, userId(auth), usuarioId, rol);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<ComunidadDTO> crear(@Valid @RequestBody CrearComunidadRequest req, Authentication auth){
        return ResponseEntity.status(HttpStatus.CREATED).body(comunidadService.crear(userId(auth), req));
    }

    @PostMapping("/{id}/unirse")
    public ResponseEntity<Void> unirse(@PathVariable Long id, Authentication auth) {
        comunidadService.unirse(id, userId(auth));
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/salir")
    public ResponseEntity<Void> salir(@PathVariable Long id, Authentication auth) {
        comunidadService.salir(id, userId(auth));
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/silenciar")
    public ResponseEntity<Void> silenciar(@PathVariable Long id,
                                          @RequestParam boolean silenciada,
                                          Authentication auth) {
        comunidadService.setSilenciada(id, userId(auth), silenciada);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/miembros/{usuarioId}/banear")
    public ResponseEntity<Void> banear(@PathVariable Long id,
                                       @PathVariable Long usuarioId,
                                       @RequestParam boolean baneado,
                                       Authentication auth) {
        comunidadService.setBaneado(id, userId(auth), usuarioId, baneado);
        return ResponseEntity.noContent().build();
    }

    private Long userId(Authentication auth) { return (Long) auth.getPrincipal(); }
}
