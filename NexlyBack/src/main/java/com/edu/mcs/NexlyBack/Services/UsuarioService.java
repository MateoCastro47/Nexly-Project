package com.edu.mcs.NexlyBack.Services;



import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.edu.mcs.NexlyBack.DTOs.UsuarioDTO;
import com.edu.mcs.NexlyBack.Mappers.UsuarioMapper;
import com.edu.mcs.NexlyBack.Repositories.UsuarioRepository;
import com.edu.mcs.NexlyBack.models.Usuario;

@Service
@Transactional(readOnly = true)
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    public UsuarioService(UsuarioRepository usuarioRepository, UsuarioMapper usuarioMapper) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioMapper = usuarioMapper;
    }

    public UsuarioDTO getPerfil(Long targetId, Long viewerId) {
        Usuario target = usuarioRepository.findById(targetId)
                .filter(Usuario::getActivo)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));

        return buildDTO(target, viewerId);
    }

    public UsuarioDTO getPerfilPorUsername(String username, Long viewerId) {
        Usuario target = usuarioRepository.findByNombreUsuario(username)
                .filter(Usuario::getActivo)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado: " + username));

        return buildDTO(target, viewerId);
    }

    public List<UsuarioDTO> buscar(String query, Long viewerId) {
        return usuarioRepository.buscarPorNombreOUsername(query)
                .stream()
                .map(u -> buildDTO(u, viewerId))
                .toList();
    }

    public boolean existeUsername(String username) {
        return usuarioRepository.existsByNombreUsuario(username);
    }

    public boolean existeEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    // --- privado: resuelve datos calculados y delega al mapper ---

    private UsuarioDTO buildDTO(Usuario target, Long viewerId) {
        Long targetId = target.getId();
        boolean esElMismo = targetId.equals(viewerId);

        return usuarioMapper.toDTO(
                target,
                usuarioRepository.countSeguidores(targetId),
                usuarioRepository.countSeguidos(targetId),
                usuarioRepository.countPublicaciones(targetId),
                !esElMismo && usuarioRepository.sigueA(targetId, viewerId),
                !esElMismo && usuarioRepository.sigueA(viewerId, targetId),
                !esElMismo && usuarioRepository.bloqueaA(viewerId, targetId),
                !esElMismo && usuarioRepository.bloqueaA(targetId, viewerId)
        );
    }
}