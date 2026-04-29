package com.edu.mcs.NexlyBack.Services.Usuario;



import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.edu.mcs.NexlyBack.DTOs.Auth.RegisterRequest;
import com.edu.mcs.NexlyBack.DTOs.Usuario.ActualizarPerfilRequest;
import com.edu.mcs.NexlyBack.DTOs.Usuario.UsuarioDTO;
import com.edu.mcs.NexlyBack.Mappers.UsuarioMapper;
import com.edu.mcs.NexlyBack.Repositories.Usuario.BloqueoRepository;
import com.edu.mcs.NexlyBack.Repositories.Usuario.SeguimientoRepository;
import com.edu.mcs.NexlyBack.Repositories.Usuario.UsuarioRepository;
import com.edu.mcs.NexlyBack.Services.Notificacion.NotificacionService;
import com.edu.mcs.NexlyBack.models.Bloqueo;
import com.edu.mcs.NexlyBack.models.Seguimiento;
import com.edu.mcs.NexlyBack.models.Usuario;
import com.edu.mcs.NexlyBack.models.Enums.EstadoSeguimiento;
import com.edu.mcs.NexlyBack.models.Enums.TipoNotificacion;

@Service
@Transactional(readOnly = true)
public class UsuarioService {

    private final PasswordEncoder passwordEncoder;
    private final SeguimientoRepository seguimientoRepository;
    private final BloqueoRepository bloqueoRepository;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;
    private final NotificacionService notificacionService;

    public UsuarioService(PasswordEncoder passwordEncoder, SeguimientoRepository seguimientoRepository,
            BloqueoRepository bloqueoRepository, UsuarioRepository usuarioRepository, UsuarioMapper usuarioMapper,
            NotificacionService notificacionService) {
        this.passwordEncoder = passwordEncoder;
        this.seguimientoRepository = seguimientoRepository;
        this.bloqueoRepository = bloqueoRepository;
        this.usuarioRepository = usuarioRepository;
        this.usuarioMapper = usuarioMapper;
        this.notificacionService = notificacionService;
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

    @Transactional
    public UsuarioDTO registrar(RegisterRequest req){
        if (usuarioRepository.existsByNombreUsuario(req.nombreUsuario())) {
            throw new IllegalArgumentException("Nombre de usuario ya en uso");
        }
        if (usuarioRepository.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Email de usuario ya registrado");
        }

        Usuario u = new Usuario();
        u.setNombreCompleto(req.nombreCompleto());
        u.setNombreUsuario(req.nombreUsuario());
        u.setEmail(req.email());
        u.setContrasenaHash(req.contrasena());
        u.setFechaNacimiento(req.fechaNacimiento());

        Usuario savedUsuario = usuarioRepository.save(u);
        return buildDTO(savedUsuario, savedUsuario.getId());
    }

    @Transactional
    public UsuarioDTO actualizarPerfil(Long userId, ActualizarPerfilRequest req) {
        Usuario u = usuarioRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));
        if (req.nombreCompleto() != null) u.setNombreCompleto(req.nombreCompleto());
        if (req.biografia()      != null) u.setBiografia(req.biografia());
        if (req.ubicacion()      != null) u.setUbicacion(req.ubicacion());
        if (req.enlaceWeb()      != null) u.setEnlaceWeb(req.enlaceWeb());
        if (req.fotoPerfil()     != null) u.setFotoPerfil(req.fotoPerfil());
        if (req.fotoPortada()    != null) u.setFotoPortada(req.fotoPortada());
        if (req.perfilPrivado()  != null) u.setPerfilPrivado(req.perfilPrivado());
        return buildDTO(usuarioRepository.save(u), userId);
    }

    @Transactional
    public void seguir(Long seguidorId, Long seguidoId){
        if (seguidorId.equals(seguidoId)) {
            throw new IllegalArgumentException("No te puedes seguir a ti mismo");
        }
        if (seguimientoRepository.existsBySeguidorIdAndSeguidoId(seguidorId, seguidoId)) {
            return;
        }
        Usuario seguidor = usuarioRepository.getReferenceById(seguidorId);
        Usuario seguido = usuarioRepository.getReferenceById(seguidoId);

        EstadoSeguimiento estado = seguido.getPerfilPrivado() ? EstadoSeguimiento.PENDIENTE : EstadoSeguimiento.ACEPTADA;
        seguimientoRepository.save(new Seguimiento(seguidor, seguido, estado, false, null));

        if (estado == EstadoSeguimiento.ACEPTADA) {
            notificacionService.emitir(seguidoId, seguidorId, TipoNotificacion.NUEVO_SEGUIDOR, null);
        }
    }

    @Transactional
    public void dejarDeSeguir(Long seguidorId, Long seguidoId) {
        seguimientoRepository.deleteBySeguidorIdAndSeguidoId(seguidorId, seguidoId);
    }

    @Transactional 
    public void bloquear(Long bloqueadorId, Long bloqueadoId){
        if (bloqueadorId.equals(bloqueadoId)) {
            throw new IllegalArgumentException("No puedes bloquearte a ti mismo");
        }
        if (!bloqueoRepository.existsByBloqueadorIdAndBloqueadoId(bloqueadorId, bloqueadoId)) {
            Usuario bloqueador = usuarioRepository.getReferenceById(bloqueadorId);
            Usuario bloqueado = usuarioRepository.getReferenceById(bloqueadoId);
            bloqueoRepository.save(new Bloqueo(bloqueador, bloqueado, null));
        }

        seguimientoRepository.deleteBySeguidorIdAndSeguidoId(bloqueadorId, bloqueadoId);
        seguimientoRepository.deleteBySeguidorIdAndSeguidoId(bloqueadoId, bloqueadorId);
    }

    @Transactional
    public void desbloquear(Long bloqueadorId, Long bloqueadoId){
        bloqueoRepository.deleteByBloqueadorIdAndBloqueadoId(bloqueadorId, bloqueadoId);
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