package com.edu.mcs.NexlyBack.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.edu.mcs.NexlyBack.models.Conversacion;

@Repository
public interface ConversacionRepository extends JpaRepository<Conversacion, Long> {
    
    @Query("SELEct c FROM Conversacon c JOIN ParticipanteConversacion p ON p.conversacion = c" + "WHERE p.usuario.id = :userId ORDER BY c.ultimoMensaje DESC NULLS LAST")
    List<Conversacion> findByParticipanteId(@Param("userId") Long userId);

    @Query("SELECT c FROM Conversacion c JOIN ParticipanteConversacion p1 ON p1.conversacion = c " +
           "JOIN ParticipanteConversacion p2 ON p2.conversacion = c " +
           "WHERE c.esGrupal = false AND p1.usuario.id = :u1 AND p2.usuario.id = :u2")
    Optional<Conversacion> findDirecta(@Param("u1") Long u1, @Param("u2") Long u2);
}
