package com.edu.mcs.NexlyBack.Repositories.Publicacion;

import com.edu.mcs.NexlyBack.models.ReaccionComentario;
import com.edu.mcs.NexlyBack.models.Keys.ReaccionComentarioId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReaccionComentarioRepository extends JpaRepository<ReaccionComentario, ReaccionComentarioId> {

    Optional<ReaccionComentario> findByUsuarioIdAndComentarioId(Long usuarioId, Long comentarioId);

    @Modifying
    @Query("DELETE FROM ReaccionComentario r WHERE r.usuario.id = :usuarioId AND r.comentario.id = :comentarioId")
    void deleteByUsuarioIdAndComentarioId(@Param("usuarioId") Long usuarioId,
                                           @Param("comentarioId") Long comentarioId);
}
