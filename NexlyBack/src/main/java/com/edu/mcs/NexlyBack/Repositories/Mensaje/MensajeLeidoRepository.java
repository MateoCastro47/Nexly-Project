package com.edu.mcs.NexlyBack.Repositories.Mensaje;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.edu.mcs.NexlyBack.models.MensajeLeido;
import com.edu.mcs.NexlyBack.models.Keys.MensajeLeidoId;

@Repository
public interface MensajeLeidoRepository extends JpaRepository<MensajeLeido, MensajeLeidoId>{
    
    boolean existsByMensajeIdAndUsuarioId(Long mensajeId, Long usuarioId);
    List<MensajeLeido> findByMensajeConversacionIdAndUsuarioId(Long convId, Long userId);
    @Query("SELECT COUNT(m) FROM Mensaje m WHERE m.conversacion.id = :convId " +
           "AND m.remitente.id != :userId " +
           "AND NOT EXISTS (SELECT 1 FROM MensajeLeido ml WHERE ml.mensaje = m AND ml.usuario.id = :userId)")
    long countUnreadByConversacionIdAndUsuarioId(@Param("convId") Long convId, @Param("userId") Long userId);


}


