package com.edu.mcs.NexlyBack.Repositories.Auth;

import com.edu.mcs.NexlyBack.models.TokenVerificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface TokenVerificacionRepository extends JpaRepository<TokenVerificacion, Long> {

    Optional<TokenVerificacion> findByToken(String token);

    @Modifying
    @Transactional
    void deleteByUsuarioId(Long usuarioId);
}
