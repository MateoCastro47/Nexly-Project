package com.edu.mcs.NexlyBack.Controllers.Admin;

import com.edu.mcs.NexlyBack.DTOs.Admin.AdminComunidadDTO;
import com.edu.mcs.NexlyBack.DTOs.Admin.AdminPublicacionDTO;
import com.edu.mcs.NexlyBack.DTOs.Admin.AdminStatsDTO;
import com.edu.mcs.NexlyBack.DTOs.Admin.AdminUsuarioDTO;
import com.edu.mcs.NexlyBack.Services.Admin.AdminService;
import com.edu.mcs.NexlyBack.models.Enums.Rol;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> stats() {
        return ResponseEntity.ok(adminService.stats());
    }

    // ── Usuarios ──
    @GetMapping("/usuarios")
    public ResponseEntity<Page<AdminUsuarioDTO>> usuarios(
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.listarUsuarios(q, page, size));
    }

    @PatchMapping("/usuarios/{id}/estado")
    public ResponseEntity<Void> estado(@PathVariable Long id, @RequestParam boolean activo, Authentication auth) {
        adminService.cambiarEstadoUsuario(userId(auth), id, activo);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/usuarios/{id}/rol")
    public ResponseEntity<Void> rol(@PathVariable Long id, @RequestParam Rol rol, Authentication auth) {
        adminService.cambiarRolUsuario(userId(auth), id, rol);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id, Authentication auth) {
        adminService.eliminarUsuario(userId(auth), id);
        return ResponseEntity.noContent().build();
    }

    // ── Publicaciones ──
    @GetMapping("/publicaciones")
    public ResponseEntity<Page<AdminPublicacionDTO>> publicaciones(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.listarPublicaciones(page, size));
    }

    @DeleteMapping("/publicaciones/{id}")
    public ResponseEntity<Void> eliminarPublicacion(@PathVariable Long id) {
        adminService.eliminarPublicacion(id);
        return ResponseEntity.noContent().build();
    }

    // ── Comunidades ──
    @GetMapping("/comunidades")
    public ResponseEntity<Page<AdminComunidadDTO>> comunidades(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.listarComunidades(page, size));
    }

    @DeleteMapping("/comunidades/{id}")
    public ResponseEntity<Void> eliminarComunidad(@PathVariable Long id) {
        adminService.eliminarComunidad(id);
        return ResponseEntity.noContent().build();
    }

    private Long userId(Authentication auth) { return (Long) auth.getPrincipal(); }
}
