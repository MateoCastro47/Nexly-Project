package com.edu.mcs.NexlyBack.Repositories.Comunidad;

import com.edu.mcs.NexlyBack.models.Comunidad;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComunidadRepository extends JpaRepository<Comunidad, Long> {

    // Buscar comunidad por nombre exacto
    Optional<Comunidad> findByNombre(String nombre);

    // Verificar si ya existe el nombre (para creación)
    boolean existsByNombre(String nombre);

    // Comunidades creadas por un usuario
    List<Comunidad> findByCreadorIdOrderByFechaCreacionDesc(Long creadorId);

    // Comunidades por categoría
    List<Comunidad> findByCategoriaIdOrderByFechaCreacionDesc(Long categoriaId);

    Page<Comunidad> findByEsPublicaTrueOrderByFechaCreacionDesc(Pageable pageable);

    @Query("SELECT c FROM Comunidad c WHERE LOWER(c.nombre) LIKE LOWER(CONCAT('%', :q, '%'))")
    Page<Comunidad> buscarPorNombre(@Param("q") String q, Pageable pageable);

    @Modifying
    @Query("UPDATE Comunidad c SET c.creador = null WHERE c.creador.id = :userId")
    void nullifyCreador(@Param("userId") Long userId);

    // Conteo de miembros aceptados en una comunidad
    @Query("SELECT COUNT(m) FROM MiembroComunidad m WHERE m.comunidad.id = :id " +
           "AND m.estado = com.edu.mcs.NexlyBack.models.Enums.EstadoMiembro.ACEPTADO")
    long countMiembros(@Param("id") Long id);
}
