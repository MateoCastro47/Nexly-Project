package com.edu.mcs.NexlyBack.Repositories;

import com.edu.mcs.NexlyBack.models.ParticipanteConversacion;
import com.edu.mcs.NexlyBack.models.Keys.ParticipanteConversacionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipanteConversacionRepository extends JpaRepository<ParticipanteConversacion, ParticipanteConversacionId> {
    boolean existsByConversacionIdAndUsuarioId(Long conversacionId, Long usuarioId);
}
