package com.edu.mcs.NexlyBack.Repositories;

import com.edu.mcs.NexlyBack.models.Comunidad;
import org.springframework.data.jpa.repository.JpaRepository;
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

    // Comunidades públicas (para explorar)
    List<Comunidad> findByEsPublicaTrueOrderByFechaCreacionDesc();

    // Comunidades por categoría
    List<Comunidad> findByCategoriaIdOrderByFechaCreacionDesc(Long categoriaId);

    // Buscar comunidades por nombre (búsqueda parcial)
    @Query("SELECT c FROM Comunidad c WHERE LOWER(c.nombre) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Comunidad> buscarPorNombre(@Param("q") String query);

    // Conteo de miembros aceptados en una comunidad
    @Query("SELECT COUNT(m) FROM MiembroComunidad m WHERE m.comunidad.id = :id " +
           "AND m.estado = com.edu.mcs.NexlyBack.models.Enums.EstadoMiembro.ACEPTADO")
    long countMiembros(@Param("id") Long id);
}
