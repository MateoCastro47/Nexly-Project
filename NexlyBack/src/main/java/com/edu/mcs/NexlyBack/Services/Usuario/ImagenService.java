package com.edu.mcs.NexlyBack.Services.Usuario;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;

@Service
public class ImagenService {
    
    private final Cloudinary cloudinary;

    public ImagenService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    private static final Set<String> CARPETAS_PERMITIDAS = Set.of("publicaciones", "perfiles", "portadas");

    public String subir(MultipartFile archivo, String carpeta){
        String contentType = archivo.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Solo se permiten imágenes");
        }
        if (!CARPETAS_PERMITIDAS.contains(carpeta)) {
            throw new IllegalArgumentException("Carpeta no permitida");
        }
        try{
            Map<?,?> resultado = cloudinary.uploader().upload(
                archivo.getBytes(),
                Map.of(
                    "folder", "nexly/" + carpeta,
                    "public_id", UUID.randomUUID().toString(),
                    "overwrite", true
                )
            );
            return (String) resultado.get("secure_url");
        }catch (IOException e){
            throw new RuntimeException("Error al subir imagen", e);
        }
    }
}
