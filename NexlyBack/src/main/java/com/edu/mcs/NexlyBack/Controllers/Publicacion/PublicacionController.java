package com.edu.mcs.NexlyBack.Controllers.Publicacion;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.edu.mcs.NexlyBack.DTOs.Publicacion.PublicacionDTO;
import com.edu.mcs.NexlyBack.Services.Publicacion.PublicacionService;
import com.edu.mcs.NexlyBack.models.Enums.TipoMedia;
import com.edu.mcs.NexlyBack.models.Enums.TipoReaccion;
import com.edu.mcs.NexlyBack.models.Enums.Visibilidad;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/api/publicaciones")
public class PublicacionController {
    
    private final PublicacionService publicacionService;

    public PublicacionController(PublicacionService publicacionService) {
        this.publicacionService = publicacionService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublicacionDTO> getPublicacion(@PathVariable Long id, Authentication auth){
        return ResponseEntity.ok(publicacionService.getPublicacion(id, userId(auth)));
    }
    @GetMapping("/feed")
    public ResponseEntity<Page<PublicacionDTO>> getFeed(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, Authentication auth) {
        return ResponseEntity.ok(publicacionService.getFeed(userId(auth), page, size));
    }
    
    @GetMapping("/usuario/{userId}")
    public ResponseEntity<Page<PublicacionDTO>> getDeUsuario(@PathVariable Long userId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, Authentication auth) {
        return ResponseEntity.ok(publicacionService.getPublicacionesDeUsuario(userId, userId(auth), page, size));
    }

    @PostMapping
    public ResponseEntity<PublicacionDTO> crear(
        @RequestParam @NotBlank String contenido,
        @RequestParam(required = false) Visibilidad visibilidad,
        @RequestParam(required = false) Long comunidadId,
        @RequestParam(required = false) List<String> imagenes,
        @RequestParam(required = false) List<String> mediaUrls,
        @RequestParam(required = false) List<TipoMedia> mediaTipos,
        Authentication auth){
            PublicacionDTO dto = publicacionService.crear(
                userId(auth), contenido, visibilidad, comunidadId, imagenes, mediaUrls, mediaTipos);
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PublicacionDTO> editar(@PathVariable Long id, @RequestParam @NotBlank String contenido, @RequestParam(required = false) Visibilidad visibilidad, Authentication auth) {
        return ResponseEntity.ok(publicacionService.editar(id, userId(auth), contenido, visibilidad));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, Authentication auth){
        publicacionService.eliminar(id, userId(auth));
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{id}/reacciones")
    public ResponseEntity<Void> reaccionar(
        @PathVariable Long id, 
        @RequestParam TipoReaccion tipo, 
        Authentication auth){

            publicacionService.reaccionar(id, userId(auth), tipo);
            return ResponseEntity.noContent().build();

    }
    
    @DeleteMapping("/{id}/reacciones")
    public ResponseEntity<Void> quitarReaccion(@PathVariable Long id, Authentication auth){
        publicacionService.quitarReaccion(id, userId(auth));
        return ResponseEntity.noContent().build();
    }

    private Long userId(Authentication auth) { return (Long) auth.getPrincipal(); }
}
