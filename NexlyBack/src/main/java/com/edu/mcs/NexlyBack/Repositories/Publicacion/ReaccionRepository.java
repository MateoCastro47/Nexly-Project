package com.edu.mcs.NexlyBack.Repositories.Publicacion;

import com.edu.mcs.NexlyBack.models.Reaccion;
import com.edu.mcs.NexlyBack.models.Keys.ReaccionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReaccionRepository extends JpaRepository<Reaccion, ReaccionId> {

    Optional<Reaccion> findByUsuarioIdAndPublicacionId(Long usuarioId, Long publicacionId);

    @Modifying
    @Query("DELETE FROM Reaccion r WHERE r.usuario.id = :usuarioId AND r.publicacion.id = :publicacionId")
    void deleteByUsuarioIdAndPublicacionId(@Param("usuarioId") Long usuarioId,
                                           @Param("publicacionId") Long publicacionId);
}
