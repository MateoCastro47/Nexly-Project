package com.edu.mcs.NexlyBack.Repositories.Notificacion;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.edu.mcs.NexlyBack.models.Notificacion;


public interface NotificacionRepository extends JpaRepository<Notificacion, Long>{
    
    Page<Notificacion> findByDestinatarioIdOrderByFechaCreacionDesc(Long destinatarioId, Pageable pageable);

    long countByDestinatarioIdAndLeidaFalse(Long destinatarioId);

    @Modifying
    @Query("UPDATE Notificacion n SET n.leida = true WHERE n.destinatario.id = :destinatarioId AND n.leida = false")
    void marcarTodasLeidas(Long destinatarioId);
}
