package com.edu.mcs.NexlyBack.Repositories.Mensaje;

import com.edu.mcs.NexlyBack.models.Mensaje;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {
    List<Mensaje> findByConversacionIdOrderByFechaEnvioAsc(Long conversacionId);
    Optional<Mensaje> findTopByConversacionIdOrderByFechaEnvioDesc(Long conversacionId);
    Page<Mensaje> findByConversacionIdOrderByFechaEnvioDesc(Long conversacionId, Pageable pageable);
}