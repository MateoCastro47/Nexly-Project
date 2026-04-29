package com.edu.mcs.NexlyBack.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.edu.mcs.NexlyBack.Services.ImagenService;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/api/imagenes")
public class ImagenController {
    
    private final ImagenService imagenService;

    public ImagenController(ImagenService imagenService) {
        this.imagenService = imagenService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> upload(
        @RequestParam MultipartFile archivo,
        @RequestParam(defaultValue = "publicaciones") String carpeta,
        Authentication auth) {

            String url = imagenService.subir(archivo, carpeta);
            return ResponseEntity.ok(Map.of("url", url));
    }
}
