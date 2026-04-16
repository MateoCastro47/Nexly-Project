package com.edu.mcs.NexlyBack.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.edu.mcs.NexlyBack.models.Comentario;
import com.edu.mcs.NexlyBack.models.Enums.TipoReaccion;

@Repository
public interface ComentarioRepository {
    List<Comentario> findbyPublicacionIdAndComentarioPadre(Long publicacionId);

    List<Comentario> findByComentarioPadreIdOrderByFechaCreacion(Long comentarioPadreId);

    long countByPublicacionId(Long publicacionId);

    long countByComentarioPadreId(Long padreId);

    
    @Query("SELECT COUNT(r) FROM ReaccionComentario r WHERE r.comentario.id = :id")
    long countReacciones(@Param("id") Long id);

    @Query("SELECT r.tipo FROM ReaccionComentario r WHERE r.comentario.id = :comentarioId AND r.usuario.id = :usuarioId")
    Optional<TipoReaccion> findReaccionDelVisor(@Param("comentarioId") Long comentarioId,
                                                 @Param("usuarioId") Long usuarioId);
}
