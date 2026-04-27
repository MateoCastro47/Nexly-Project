package com.edu.mcs.NexlyBack.Services;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.edu.mcs.NexlyBack.DTOs.Comunidad.ComunidadDTO;
import com.edu.mcs.NexlyBack.DTOs.Comunidad.CrearComunidadRequest;
import com.edu.mcs.NexlyBack.DTOs.Publicacion.AutorResumenDTO;
import com.edu.mcs.NexlyBack.Mappers.Comunidad.ComunidadMapper;
import com.edu.mcs.NexlyBack.Mappers.Publicacion.AutorResumenMapper;
import com.edu.mcs.NexlyBack.Repositories.ComunidadRepository;
import com.edu.mcs.NexlyBack.Repositories.MiembroComunidadRepository;
import com.edu.mcs.NexlyBack.Repositories.UsuarioRepository;
import com.edu.mcs.NexlyBack.models.Comunidad;
import com.edu.mcs.NexlyBack.models.MiembroComunidad;
import com.edu.mcs.NexlyBack.models.Usuario;
import com.edu.mcs.NexlyBack.models.Enums.EstadoMiembro;
import com.edu.mcs.NexlyBack.models.Enums.RolComunidad;

@Service
@Transactional(readOnly = true)
public class ComunidadService {
    
    private final ComunidadRepository comunidadRepository;
    private final MiembroComunidadRepository miembroComunidadRepository;
    private final UsuarioRepository usuarioRepository;
    private final ComunidadMapper comunidadMapper;
    private final AutorResumenMapper autorResumenMapper;

    
    public ComunidadService(ComunidadRepository comunidadRepository,
            MiembroComunidadRepository miembroComunidadRepository, UsuarioRepository usuarioRepository,
            ComunidadMapper comunidadMapper, AutorResumenMapper autorResumenMapper) {
        this.comunidadRepository = comunidadRepository;
        this.miembroComunidadRepository = miembroComunidadRepository;
        this.usuarioRepository = usuarioRepository;
        this.comunidadMapper = comunidadMapper;
        this.autorResumenMapper = autorResumenMapper;
    }

    public ComunidadDTO getComunidad(Long id, Long viewerId){
        Comunidad c = comunidadRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Comunidad no encontrada"));
        return buildDTO(c, viewerId);
    }

    public Page<ComunidadDTO> buscar(String q, Long viewerId, int page, int size){
        return comunidadRepository.buscarPorNombre(q, PageRequest.of(page, size)).map(c -> buildDTO(c, viewerId));
    }

    public Page<ComunidadDTO> getPublicas(Long viewerId, int page, int size){
        return comunidadRepository.findByEsPublicaTrueOrderByFechaCreacionDesc(PageRequest.of(page, size)).map(c -> buildDTO(c, viewerId));
    }

    @Transactional
    public ComunidadDTO crear(Long userId, CrearComunidadRequest req){
        if (comunidadRepository.existsByNombre(req.nombre())) {
            throw new IllegalArgumentException("Ya existe una comunidad con ese nombre");
        }
        Usuario creador = usuarioRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));

        Comunidad c = new Comunidad();
        c.setCreador(creador);
        c.setNombre(req.nombre());
        c.setDescripcion(req.descripcion());
        c.setReglas(req.reglas());
        c.setFoto(req.foto());
        c.setEsPublica(req.esPublica() != null ? req.esPublica() : true);

        Comunidad saved = comunidadRepository.save(c);

        MiembroComunidad miembro = new MiembroComunidad(creador, saved, RolComunidad.ADMIN, EstadoMiembro.ACEPTADO, false, false, null);
        miembroComunidadRepository.save(miembro);

        return buildDTO(saved, userId);
    }

    @Transactional
    public void unirse(Long comunidadId, Long userId) {
        Comunidad c = comunidadRepository.findById(comunidadId)
                .orElseThrow(() -> new NoSuchElementException("Comunidad no encontrada"));

        if (miembroComunidadRepository.existsByComunidadIdAndUsuarioId(comunidadId, userId))
            throw new IllegalArgumentException("Ya eres miembro o tienes solicitud pendiente");

        Usuario usuario = usuarioRepository.getReferenceById(userId);
        EstadoMiembro estado = c.getEsPublica() ? EstadoMiembro.ACEPTADO : EstadoMiembro.PENDIENTE;
        miembroComunidadRepository.save(new MiembroComunidad(usuario, c, RolComunidad.MIEMBRO, estado, false, false, null));
    }

    @Transactional
    public void salir(Long comunidadId, Long userId) {
        MiembroComunidad m = miembroComunidadRepository.findByComunidadIdAndUsuarioId(comunidadId, userId)
                .orElseThrow(() -> new NoSuchElementException("No eres miembro de esta comunidad"));
        if (m.getRol() == RolComunidad.ADMIN)
            throw new IllegalStateException("El administrador no puede salir; transfiere el rol primero");
        miembroComunidadRepository.delete(m);
    }

    @Transactional
    public void setSilenciada(Long comunidadId, Long userId, boolean silenciada) {
        MiembroComunidad m = miembroComunidadRepository.findByComunidadIdAndUsuarioId(comunidadId, userId)
                .orElseThrow(() -> new NoSuchElementException("No eres miembro de esta comunidad"));
        m.setSilenciada(silenciada);
        miembroComunidadRepository.save(m);
    }

    @Transactional
    public void setBaneado(Long comunidadId, Long adminId, Long objetivoId, boolean baneado) {
        MiembroComunidad admin = miembroComunidadRepository.findByComunidadIdAndUsuarioId(comunidadId, adminId)
                .orElseThrow(() -> new NoSuchElementException("No eres miembro de esta comunidad"));
        if (admin.getRol() != RolComunidad.ADMIN && admin.getRol() != RolComunidad.MOD)
            throw new IllegalStateException("Sin permisos para banear miembros");

        MiembroComunidad objetivo = miembroComunidadRepository.findByComunidadIdAndUsuarioId(comunidadId, objetivoId)
                .orElseThrow(() -> new NoSuchElementException("El usuario no es miembro de esta comunidad"));
        if (objetivo.getRol() == RolComunidad.ADMIN)
            throw new IllegalStateException("No puedes banear al administrador");

        objetivo.setBaneado(baneado);
        miembroComunidadRepository.save(objetivo);
    }

    private ComunidadDTO buildDTO(Comunidad c, Long viewerId) {
        AutorResumenDTO creador = autorResumenMapper.toDTO(c.getCreador());
        String categoria = c.getCategoria() != null ? c.getCategoria().getNombre() : null;
        long totalMiembros = comunidadRepository.countMiembros(c.getId());
        boolean esMiembro = viewerId != null && miembroComunidadRepository.existsByComunidadIdAndUsuarioId(c.getId(), viewerId);
        boolean esCreador = viewerId != null && c.getCreador().getId().equals(viewerId);
        return comunidadMapper.toDTO(c, creador, categoria, totalMiembros, esMiembro, esCreador);
    }
}
