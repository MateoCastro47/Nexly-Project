package com.edu.mcs.NexlyBack.Repositories;

import com.edu.mcs.NexlyBack.models.Comentario;
import com.edu.mcs.NexlyBack.models.Enums.TipoReaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {

    // Comentarios raíz de una publicación 
    List<Comentario> findByPublicacionIdAndComentarioPadreIsNullOrderByFechaCreacionAsc(Long publicacionId);

    // Respuestas a un comentario
    List<Comentario> findByComentarioPadreIdOrderByFechaCreacionAsc(Long comentarioPadreId);

    // Conteo total de comentarios de una publicación
    long countByPublicacionId(Long publicacionId);

    // Conteo de respuestas de un comentario
    long countByComentarioPadreId(Long padreId);

    // Conteo de reacciones sobre un comentario
    @Query("SELECT COUNT(r) FROM ReaccionComentario r WHERE r.comentario.id = :id")
    long countReacciones(@Param("id") Long id);

    // Reacción del visor sobre un comentario (null si no ha reaccionado)
    @Query("SELECT r.tipo FROM ReaccionComentario r WHERE r.comentario.id = :comentarioId AND r.usuario.id = :usuarioId")
    Optional<TipoReaccion> findReaccionDelVisor(@Param("comentarioId") Long comentarioId,
                                                 @Param("usuarioId") Long usuarioId);
}
