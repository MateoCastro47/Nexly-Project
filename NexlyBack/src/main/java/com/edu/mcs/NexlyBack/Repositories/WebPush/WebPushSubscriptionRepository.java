package com.edu.mcs.NexlyBack.Repositories.WebPush;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.edu.mcs.NexlyBack.models.WebPushSubscriptions;

public interface WebPushSubscriptionRepository extends JpaRepository<WebPushSubscriptions, Long>{
    
    List<WebPushSubscriptions> findByUsuarioId(Long usuarioId);

    Optional<WebPushSubscriptions> findByEndpoint(String endpoint);

    @Modifying
    @Query("DELETE FROM WebPushSubscriptions s WHERE s.endpoint = :endpoint")
    void deleteByEndpoint(@Param("endpoint") String endpoint);

    @Modifying
    @Query("DELETE FROM WebPushSubscriptions s WHERE s.usuario.id = :userId")
    void deleteByUsuarioId(@Param("userId") Long userId);
}
