package com.edu.mcs.NexlyBack.Repositories.Usuario;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.edu.mcs.NexlyBack.models.Bloqueo;
import com.edu.mcs.NexlyBack.models.Enums.EstadoSeguimiento;
import com.edu.mcs.NexlyBack.models.Seguimiento;
import com.edu.mcs.NexlyBack.models.Usuario;


@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
    
    //Usuario Base
    Optional<Usuario> findByNombreUsuario(String nombreUsuario);
    Optional<Usuario> findByEmail(String email);
    boolean existsByNombreUsuario(String nombreUsuario);
    boolean existsByEmail(String email);

    @Query("""
            SELECT u FROM Usuario u
            WHERE u.activo = true
            AND (LOWER(u.nombreUsuario) LIKE LOWER(CONCAT('%', :q, '%'))
            OR LOWER(u.nombreCompleto) LIKE LOWER(CONCAT('%', :q, '%')))
            """)
    List<Usuario> buscarPorNombreOUsername(@Param("q") String query);

    //Seguimiento
    @Query("""
            SELECT s FROM Seguimiento s
            WHERE s.seguidor.id = :seguidorId
            AND s.seguido.id = :seguidoId
            """)
    Optional<Seguimiento> findSeguimiento(@Param("seguidorId") Long seguidorId, @Param("seguidoId") Long seguidoId);

    default boolean sigueA(Long seguidorId, Long seguidoId) {
        return findSeguimiento(seguidorId, seguidoId)
        .map(s -> s.getEstado() == EstadoSeguimiento.ACEPTADA)
        .orElse(false);
    }

    @Query("SELECT COUNT(s) FROM Seguimiento s WHERE s.seguido.id = :id AND s.estado = com.edu.mcs.NexlyBack.models.Enums.EstadoSeguimiento.ACEPTADA")
    long countSeguidores(@Param("id") Long id);

    @Query("SELECT COUNT(s) FROM Seguimiento s WHERE s.seguidor.id = :id AND s.estado = com.edu.mcs.NexlyBack.models.Enums.EstadoSeguimiento.ACEPTADA")
    long countSeguidos(@Param("id") Long id);

    //Bloqueo
    @Query("""
            SELECT b FROM Bloqueo b
            WHERE b.bloqueador.id = :bloqueadorId
            AND b.bloqueado.id = :bloqueadoId
            """)
    Optional<Bloqueo> findBloqueo(@Param("bloqueadorId") Long bloqueadorId, @Param("bloqueadoId") Long bloqueadoId);
    
    default boolean bloqueaA(Long bloqueadorId, Long bloqueadoId){
        return findBloqueo(bloqueadorId, bloqueadoId).isPresent();
    }

    @Query("SELECT COUNT(p) FROM Publicacion p WHERE p.usuario.id = :id")
    long countPublicaciones(@Param("id") Long id);

    @Query("""
            SELECT u FROM Usuario u
            WHERE u.id != :viewerId
              AND u.activo = true
              AND NOT EXISTS (
                SELECT s FROM Seguimiento s
                WHERE s.seguidor.id = :viewerId AND s.seguido.id = u.id
              )
              AND NOT EXISTS (
                SELECT b FROM Bloqueo b
                WHERE (b.bloqueador.id = :viewerId AND b.bloqueado.id = u.id)
                   OR (b.bloqueador.id = u.id      AND b.bloqueado.id = :viewerId)
              )
            ORDER BY u.fechaRegistro DESC
            """)
    List<Usuario> findSugerencias(@Param("viewerId") Long viewerId, Pageable pageable);

}
