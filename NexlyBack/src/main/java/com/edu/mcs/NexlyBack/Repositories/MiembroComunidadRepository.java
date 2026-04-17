package com.edu.mcs.NexlyBack.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.edu.mcs.NexlyBack.models.Enums.EstadoMiembro;
import com.edu.mcs.NexlyBack.models.Keys.MiembroComunidadId;
import com.edu.mcs.NexlyBack.models.MiembroComunidad;

@Repository
public interface MiembroComunidadRepository extends JpaRepository<MiembroComunidad, MiembroComunidadId> {

    Optional<MiembroComunidad> findByUsuarioIdAndComunidadId(Long usuarioId, Long comunidadId);

    boolean existsByUsuarioIdAndComunidadIdAndEstado(Long usuarioId, Long comunidadId, EstadoMiembro estado);

    List<MiembroComunidad> findByComunidadIdAndEstado(Long comunidadId, EstadoMiembro estado);

    @Query("SELECT m FROM MiembroComunidad m WHERE m.usuario.id = :usuarioId AND m.estado = :estado")
    List<MiembroComunidad> findComunidadesDeUsuario(@Param("usuarioId") Long usuarioId,
                                                    @Param("estado") EstadoMiembro estado);
}