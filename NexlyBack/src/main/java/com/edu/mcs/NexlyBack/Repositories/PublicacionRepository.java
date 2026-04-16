package com.edu.mcs.NexlyBack.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.edu.mcs.NexlyBack.models.Enums.TipoReaccion;
import com.edu.mcs.NexlyBack.models.Enums.Visibilidad;
import com.edu.mcs.NexlyBack.models.Publicacion;

@Repository
public interface PublicacionRepository extends JpaRepository<Publicacion, Long> {
    //Publicaciones de un usuario 
    List<Publicacion> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);

    //Feed: publicaciones públicas de una lista de usuarios seguidos.
    @Query("SELECT p FROM Publicacion p WHERE p.usuario.id IN :ids " +
       "AND p.visibilidad = :visibilidad " +
       "ORDER BY p.fechaCreacion DESC")
    List<Publicacion> findPublicacionesDeSeguidos(
        @Param("ids") List<Long> ids,
        @Param("visibilidad") Visibilidad visibilidad
    );

    //Conteo de reacciones para una publicación
    @Query("SELECT COUNT(r) FROM Reaccion r WHERE r.publicacion.id = :id")
    long countReacciones(@Param("id") Long id);

    //Conteo de comentario raíz (sin padre) para una publicación
    @Query("SELECT r.tipo FROM Reaccion r WHERE r.publicacion.id = :publicacionId AND r.usuario.id = :usuarioId")
    Optional<TipoReaccion> findReaccion(@Param("publicacionId") Long publicacionId, @Param("usuarioId") Long usuarioId);
    
}
