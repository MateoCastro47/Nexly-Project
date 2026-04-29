package com.edu.mcs.NexlyBack.Controllers.Publicacion;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edu.mcs.NexlyBack.DTOs.Publicacion.ComentarioDTO;
import com.edu.mcs.NexlyBack.Services.Publicacion.ComentarioService;
import com.edu.mcs.NexlyBack.models.Enums.TipoReaccion;

import jakarta.validation.constraints.NotBlank;

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
@RequestMapping("/api")
public class ComentarioController {
    
    private final ComentarioService comentarioService;

    public ComentarioController(ComentarioService comentarioService) {
        this.comentarioService = comentarioService;
    }

    @GetMapping("/publicaciones/{pubId}/comentarios")
    public ResponseEntity<Page<ComentarioDTO>> getComentarios(@PathVariable Long pubId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size ,Authentication auth){
        return ResponseEntity.ok(comentarioService.getComentarios(pubId, userId(auth), page, size));
    }

    @GetMapping("/comentarios/{id}/respuestas")
    public ResponseEntity<Page<ComentarioDTO>> getRespuestas(@PathVariable Long id, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size ,Authentication auth){
        return ResponseEntity.ok(comentarioService.getRespuestas(id, userId(auth), page, size));
    }
    
    @PostMapping("/publicaciones/{pubId}/comentarios")
    public ResponseEntity<ComentarioDTO> comentar(
        @PathVariable Long pubId,
        @RequestParam @NotBlank String contenido,
        @RequestParam(required = false) Long padreId,
        Authentication auth){
            ComentarioDTO dto = comentarioService.comentar(pubId, userId(auth), contenido, padreId);
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PutMapping("/comentarios/{id}")
    public ResponseEntity<ComentarioDTO> editar(@PathVariable Long id, @RequestParam @NotBlank String contenido, Authentication auth) {
        return ResponseEntity.ok(comentarioService.editar(id, userId(auth), contenido));
    }

    @DeleteMapping("/comentarios/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, Authentication auth){
        comentarioService.eliminar(id, userId(auth));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/comentarios/{id}/reacciones")
    public ResponseEntity<Void> reaccionar(@PathVariable Long id, @RequestParam TipoReaccion tipo, Authentication auth) {
        comentarioService.reaccionar(id, userId(auth), tipo);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/comentarios/{id}/reacciones")
    public ResponseEntity<Void> quitarReaccion(@PathVariable Long id, Authentication auth){
        comentarioService.quitarReaccion(id, userId(auth));
        return ResponseEntity.noContent().build();
    }
    
    private Long userId(Authentication auth) { return (Long) auth.getPrincipal(); }

}
