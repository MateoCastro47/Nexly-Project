package com.edu.mcs.NexlyBack.Repositories;

import com.edu.mcs.NexlyBack.models.Enums.EstadoSeguimiento;
import com.edu.mcs.NexlyBack.models.Keys.SeguimientoId;
import com.edu.mcs.NexlyBack.models.Seguimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeguimientoRepository extends JpaRepository<Seguimiento, SeguimientoId> {

    Optional<Seguimiento> findBySeguidorIdAndSeguidoId(Long seguidorId, Long seguidoId);

    boolean existsBySeguidorIdAndSeguidoId(Long seguidorId, Long seguidoId);

    @Modifying
    @Query("DELETE FROM Seguimiento s WHERE s.seguidor.id = :seguidorId AND s.seguido.id = :seguidoId")
    void deleteBySeguidorIdAndSeguidoId(@Param("seguidorId") Long seguidorId,
                                        @Param("seguidoId") Long seguidoId);

    @Query("SELECT s.seguido.id FROM Seguimiento s WHERE s.seguidor.id = :seguidorId AND s.estado = :estado")
    List<Long> findSeguidosIds(@Param("seguidorId") Long seguidorId,
                               @Param("estado") EstadoSeguimiento estado);
}