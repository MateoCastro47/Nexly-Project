package com.edu.mcs.NexlyBack.Repositories.Usuario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.edu.mcs.NexlyBack.models.Bloqueo;
import com.edu.mcs.NexlyBack.models.Keys.BloqueoId;

@Repository
public interface BloqueoRepository extends JpaRepository<Bloqueo, BloqueoId> {

    boolean existsByBloqueadorIdAndBloqueadoId(Long bloqueadorId, Long bloqueadoId);

    @Modifying
    @Query("DELETE FROM Bloqueo b WHERE b.bloqueador.id = :bloqueadorId AND b.bloqueado.id = :bloqueadoId")
    void deleteByBloqueadorIdAndBloqueadoId(@Param("bloqueadorId") Long bloqueadorId,
                                             @Param("bloqueadoId") Long bloqueadoId);
}