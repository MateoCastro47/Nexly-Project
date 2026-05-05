package com.edu.mcs.NexlyBack.Repositories.Publicacion;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.edu.mcs.NexlyBack.models.Enums.TipoReaccion;
import com.edu.mcs.NexlyBack.models.Enums.Visibilidad;
import com.edu.mcs.NexlyBack.models.Publicacion;

@Repository
public interface PublicacionRepository extends JpaRepository<Publicacion, Long> {

    Page<Publicacion> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId, Pageable pageable);

    @Query("SELECT p FROM Publicacion p WHERE p.usuario.id IN :ids " +
           "AND p.visibilidad = :visibilidad ORDER BY p.fechaCreacion DESC")
    Page<Publicacion> findPublicacionesDeSeguidos(
        @Param("ids") List<Long> ids,
        @Param("visibilidad") Visibilidad visibilidad,
        Pageable pageable
    );

    @Query("SELECT p FROM Publicacion p WHERE p.visibilidad = :publica OR " +
           "(p.visibilidad = :seguidores AND p.usuario.id IN :ids) " +
           "ORDER BY p.fechaCreacion DESC")
    Page<Publicacion> findFeedGlobal(
        @Param("publica") Visibilidad publica,
        @Param("seguidores") Visibilidad seguidores,
        @Param("ids") List<Long> ids,
        Pageable pageable
    );

    //Conteo de reacciones para una publicación
    @Query("SELECT COUNT(r) FROM Reaccion r WHERE r.publicacion.id = :id")
    long countReacciones(@Param("id") Long id);

    //Conteo de comentarios raíz (sin padre) para una publicación
    @Query("SELECT COUNT(c) FROM Comentario c WHERE c.publicacion.id = :id AND c.comentarioPadre IS NULL")
    long countComentarios(@Param("id") Long id);

    //Reacción del visor sobre una publicación (null si no ha reaccionado)
    @Query("SELECT r.tipo FROM Reaccion r WHERE r.publicacion.id = :publicacionId AND r.usuario.id = :usuarioId")
    Optional<TipoReaccion> findReaccionDelVisor(@Param("publicacionId") Long publicacionId,
                                                 @Param("usuarioId") Long usuarioId);
}
