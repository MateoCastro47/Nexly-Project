package com.edu.mcs.NexlyBack.Services.Admin;

import com.edu.mcs.NexlyBack.DTOs.Admin.AdminComunidadDTO;
import com.edu.mcs.NexlyBack.DTOs.Admin.AdminPublicacionDTO;
import com.edu.mcs.NexlyBack.DTOs.Admin.AdminStatsDTO;
import com.edu.mcs.NexlyBack.DTOs.Admin.AdminUsuarioDTO;
import com.edu.mcs.NexlyBack.Repositories.Comunidad.ComunidadRepository;
import com.edu.mcs.NexlyBack.Repositories.Comunidad.MiembroComunidadRepository;
import com.edu.mcs.NexlyBack.Repositories.Publicacion.ComentarioRepository;
import com.edu.mcs.NexlyBack.Repositories.Publicacion.PublicacionRepository;
import com.edu.mcs.NexlyBack.Repositories.Publicacion.ReaccionRepository;
import com.edu.mcs.NexlyBack.Repositories.Usuario.UsuarioRepository;
import com.edu.mcs.NexlyBack.Services.Usuario.UsuarioService;
import com.edu.mcs.NexlyBack.models.Comunidad;
import com.edu.mcs.NexlyBack.models.Publicacion;
import com.edu.mcs.NexlyBack.models.Usuario;
import com.edu.mcs.NexlyBack.models.Enums.Rol;
import com.edu.mcs.NexlyBack.models.Enums.TipoPost;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.NoSuchElementException;

/**
 * Lógica del panel de administración. Solo se invoca desde endpoints
 * protegidos con ROLE_ADMIN. Las acciones que afectan al propio administrador
 * (desactivarse, cambiarse el rol o borrarse) se bloquean para evitar dejar
 * la plataforma sin administradores por error.
 */
@Service
@Transactional(readOnly = true)
public class AdminService {

    private final UsuarioRepository usuarioRepository;
    private final PublicacionRepository publicacionRepository;
    private final ComunidadRepository comunidadRepository;
    private final ComentarioRepository comentarioRepository;
    private final ReaccionRepository reaccionRepository;
    private final MiembroComunidadRepository miembroComunidadRepository;
    private final UsuarioService usuarioService;

    public AdminService(UsuarioRepository usuarioRepository, PublicacionRepository publicacionRepository,
                        ComunidadRepository comunidadRepository, ComentarioRepository comentarioRepository,
                        ReaccionRepository reaccionRepository, MiembroComunidadRepository miembroComunidadRepository,
                        UsuarioService usuarioService) {
        this.usuarioRepository = usuarioRepository;
        this.publicacionRepository = publicacionRepository;
        this.comunidadRepository = comunidadRepository;
        this.comentarioRepository = comentarioRepository;
        this.reaccionRepository = reaccionRepository;
        this.miembroComunidadRepository = miembroComunidadRepository;
        this.usuarioService = usuarioService;
    }

    // ── Dashboard ──
    public AdminStatsDTO stats() {
        // Publicaciones por tipo: inicializo todos los tipos a 0 para un gráfico estable
        Map<String, Long> porTipo = new LinkedHashMap<>();
        for (TipoPost t : TipoPost.values()) porTipo.put(t.name(), 0L);
        for (Object[] fila : publicacionRepository.contarPorTipo()) {
            TipoPost tipo = (TipoPost) fila[0];
            if (tipo != null) porTipo.put(tipo.name(), (Long) fila[1]);
        }

        return new AdminStatsDTO(
                usuarioRepository.count(),
                usuarioRepository.countByActivoTrue(),
                usuarioRepository.countByEmailVerificadoTrue(),
                usuarioRepository.countByFechaRegistroAfter(LocalDateTime.now().minusDays(7)),
                publicacionRepository.count(),
                comunidadRepository.count(),
                comunidadRepository.countByEsPublicaTrue(),
                comentarioRepository.count(),
                reaccionRepository.count(),
                porTipo);
    }

    // ── Usuarios ──
    public Page<AdminUsuarioDTO> listarUsuarios(String q, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "fechaRegistro"));
        Page<Usuario> usuarios = (q == null || q.isBlank())
                ? usuarioRepository.findAll(pageable)
                : usuarioRepository.buscarAdmin(q.trim(), pageable);
        return usuarios.map(this::toUsuarioDTO);
    }

    @Transactional
    public void cambiarEstadoUsuario(Long adminId, Long usuarioId, boolean activo) {
        if (adminId.equals(usuarioId)) throw new IllegalStateException("No puedes desactivar tu propia cuenta");
        Usuario u = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));
        u.setActivo(activo);
        usuarioRepository.save(u);
    }

    @Transactional
    public void cambiarRolUsuario(Long adminId, Long usuarioId, Rol rol) {
        if (adminId.equals(usuarioId)) throw new IllegalStateException("No puedes cambiar tu propio rol");
        Usuario u = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));
        u.setRol(rol);
        usuarioRepository.save(u);
    }

    @Transactional
    public void eliminarUsuario(Long adminId, Long usuarioId) {
        if (adminId.equals(usuarioId)) throw new IllegalStateException("No puedes eliminar tu propia cuenta");
        usuarioService.eliminarUsuario(usuarioId); // reutiliza la lógica existente (notifs, nullify creador, cascada)
    }

    // ── Publicaciones ──
    public Page<AdminPublicacionDTO> listarPublicaciones(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "fechaCreacion"));
        return publicacionRepository.findAll(pageable).map(this::toPublicacionDTO);
    }

    @Transactional
    public void eliminarPublicacion(Long id) {
        Publicacion p = publicacionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Publicación no encontrada"));
        publicacionRepository.delete(p); // cascada: comentarios, reacciones e imágenes
    }

    // ── Comunidades ──
    public Page<AdminComunidadDTO> listarComunidades(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "fechaCreacion"));
        return comunidadRepository.findAll(pageable).map(this::toComunidadDTO);
    }

    @Transactional
    public void eliminarComunidad(Long id) {
        Comunidad c = comunidadRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Comunidad no encontrada"));
        publicacionRepository.desvincularDeComunidad(id); // las publicaciones se conservan como feed
        miembroComunidadRepository.deleteByComunidadId(id);
        comunidadRepository.delete(c);
    }

    // ── Mapeos privados ──
    private AdminUsuarioDTO toUsuarioDTO(Usuario u) {
        return new AdminUsuarioDTO(u.getId(), u.getNombreCompleto(), u.getNombreUsuario(), u.getEmail(),
                u.getRol().name(), Boolean.TRUE.equals(u.getActivo()),
                Boolean.TRUE.equals(u.getEmailVerificado()), u.getFechaRegistro());
    }

    private AdminPublicacionDTO toPublicacionDTO(Publicacion p) {
        return new AdminPublicacionDTO(p.getId(), p.getContenido(), p.getUsuario().getId(),
                p.getUsuario().getNombreUsuario(),
                p.getComunidad() != null ? p.getComunidad().getNombre() : null,
                p.getTipoPost() != null ? p.getTipoPost().name() : null,
                p.getFechaCreacion());
    }

    private AdminComunidadDTO toComunidadDTO(Comunidad c) {
        return new AdminComunidadDTO(c.getId(), c.getNombre(),
                c.getCategoria() != null ? c.getCategoria().getNombre() : null,
                c.getCreador() != null ? c.getCreador().getNombreUsuario() : null,
                comunidadRepository.countMiembros(c.getId()),
                Boolean.TRUE.equals(c.getEsPublica()), c.getFechaCreacion());
    }
}
