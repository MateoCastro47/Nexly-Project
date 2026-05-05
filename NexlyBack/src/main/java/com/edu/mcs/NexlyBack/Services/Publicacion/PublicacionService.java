package com.edu.mcs.NexlyBack.Services.Publicacion;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.edu.mcs.NexlyBack.DTOs.Publicacion.AutorResumenDTO;
import com.edu.mcs.NexlyBack.DTOs.Publicacion.MediaDTO;
import com.edu.mcs.NexlyBack.DTOs.Publicacion.PublicacionDTO;
import com.edu.mcs.NexlyBack.Mappers.Publicacion.AutorResumenMapper;
import com.edu.mcs.NexlyBack.Mappers.Publicacion.PublicacionMapper;
import com.edu.mcs.NexlyBack.Repositories.Comunidad.ComunidadRepository;
import com.edu.mcs.NexlyBack.Repositories.Publicacion.ComentarioRepository;
import com.edu.mcs.NexlyBack.Repositories.Publicacion.PublicacionRepository;
import com.edu.mcs.NexlyBack.Repositories.Publicacion.ReaccionComentarioRepository;
import com.edu.mcs.NexlyBack.Repositories.Publicacion.ReaccionRepository;
import com.edu.mcs.NexlyBack.Repositories.Usuario.SeguimientoRepository;
import com.edu.mcs.NexlyBack.Repositories.Usuario.UsuarioRepository;
import com.edu.mcs.NexlyBack.Services.Notificacion.NotificacionService;
import com.edu.mcs.NexlyBack.models.Comunidad;
import com.edu.mcs.NexlyBack.models.Enums.TipoMedia;
import com.edu.mcs.NexlyBack.models.Enums.TipoNotificacion;
import com.edu.mcs.NexlyBack.models.Enums.TipoReaccion;
import com.edu.mcs.NexlyBack.models.Enums.Visibilidad;
import com.edu.mcs.NexlyBack.models.Publicacion;
import com.edu.mcs.NexlyBack.models.PublicacionImagen;
import com.edu.mcs.NexlyBack.models.Reaccion;
import com.edu.mcs.NexlyBack.models.Usuario;

@Service
@Transactional(readOnly = true)
public class PublicacionService {

    private final PublicacionRepository publicacionRepository;
    private final SeguimientoRepository seguimientoRepository;
    private final ComentarioRepository comentarioRepository;
    private final ReaccionRepository reaccionRepository;
    private final ReaccionComentarioRepository reaccionComentarioRepository;
    private final UsuarioRepository usuarioRepository;
    private final ComunidadRepository comunidadRepository;
    private final PublicacionMapper publicacionMapper;
    private final AutorResumenMapper autorResumenMapper;
    private final NotificacionService notificacionService;

    public PublicacionService(PublicacionRepository publicacionRepository, SeguimientoRepository seguimientoRepository,
            ComentarioRepository comentarioRepository, ReaccionRepository reaccionRepository,
            ReaccionComentarioRepository reaccionComentarioRepository,
            UsuarioRepository usuarioRepository, ComunidadRepository comunidadRepository,
            PublicacionMapper publicacionMapper, AutorResumenMapper autorResumenMapper,
            NotificacionService notificacionService) {
        this.publicacionRepository = publicacionRepository;
        this.seguimientoRepository = seguimientoRepository;
        this.comentarioRepository = comentarioRepository;
        this.reaccionRepository = reaccionRepository;
        this.reaccionComentarioRepository = reaccionComentarioRepository;
        this.usuarioRepository = usuarioRepository;
        this.comunidadRepository = comunidadRepository;
        this.publicacionMapper = publicacionMapper;
        this.autorResumenMapper = autorResumenMapper;
        this.notificacionService = notificacionService;
    }

    public PublicacionDTO getPublicacion(Long id, Long viewerId) {
        Publicacion p = publicacionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Publicación no encontrada"));
        return buildDTO(p, viewerId);
    }

    public Page<PublicacionDTO> getPublicacionesDeUsuario(Long userId, Long viewerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Publicacion> paginaBD = publicacionRepository.findByUsuarioIdOrderByFechaCreacionDesc(userId, pageable);

        List<PublicacionDTO> contenidoFiltrado = paginaBD.getContent()
            .stream()
            .filter(p -> esVisible(p, viewerId))
            .map(p -> buildDTO(p, viewerId))
            .toList();
        
        return new PageImpl<>(contenidoFiltrado, pageable, paginaBD.getTotalElements());
    }

    @Transactional
    public PublicacionDTO crear(Long userId, String contenido, Visibilidad visibilidad,
                    Long comunidadId, List<String> imgs,
                    List<String> mediaUrls, List<TipoMedia> mediaTipos) {
        Usuario autor = usuarioRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));

        Publicacion p = new Publicacion();
        p.setUsuario(autor);
        p.setContenido(contenido);
        p.setVisibilidad(visibilidad != null ? visibilidad : Visibilidad.PUBLICA);

        if (comunidadId != null) {
            Comunidad comunidad = comunidadRepository.findById(comunidadId)
                    .orElseThrow(() -> new NoSuchElementException("Comunidad no encontrada"));
            p.setComunidad(comunidad);
        }

        List<PublicacionImagen> imagenes = new ArrayList<>();
        short orden = 0;

        if (mediaUrls != null && !mediaUrls.isEmpty()) {
            for (int i = 0; i < mediaUrls.size(); i++) {
                String url = mediaUrls.get(i);
                TipoMedia tipo = TipoMedia.IMAGEN;
                if (mediaTipos != null && i < mediaTipos.size() && mediaTipos.get(i) != null) {
                    tipo = mediaTipos.get(i);
                }
                PublicacionImagen img = new PublicacionImagen();
                img.setPublicacion(p);
                img.setUrl(url);
                img.setTipo(tipo);
                img.setOrden(orden++);
                imagenes.add(img);
            }
        } else if (imgs != null && !imgs.isEmpty()) {
            for (String url : imgs) {
                PublicacionImagen img = new PublicacionImagen();
                img.setPublicacion(p);
                img.setUrl(url);
                img.setTipo(TipoMedia.IMAGEN);
                img.setOrden(orden++);
                imagenes.add(img);
            }
        }

        if (!imagenes.isEmpty()) {
            p.setImagenes(imagenes);
        }

        return buildDTO(publicacionRepository.save(p), userId);
    }

    @Transactional
    public PublicacionDTO editar(Long id, Long userId, String contenido, Visibilidad visibilidad) {
        Publicacion p = publicacionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Publicación no encontrada"));

        if (!p.getUsuario().getId().equals(userId))
            throw new IllegalStateException("Sin permiso para editar esta publicación");

        p.setContenido(contenido);
        if (visibilidad != null) p.setVisibilidad(visibilidad);
        p.setFechaEdicion(LocalDateTime.now());

        return buildDTO(publicacionRepository.save(p), userId);
    }

    @Transactional
    public void eliminar(Long id, Long userId) {
        Publicacion p = publicacionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Publicación no encontrada"));

        if (!p.getUsuario().getId().equals(userId))
            throw new IllegalStateException("Sin permiso para eliminar esta publicación");

        reaccionComentarioRepository.deleteByPublicacionId(id);
        comentarioRepository.nullifyPadreByPublicacionId(id);
        comentarioRepository.deleteByPublicacionId(id);
        reaccionRepository.deleteByPublicacionId(id);
        publicacionRepository.delete(p);
    }

    @Transactional
    public void reaccionar(Long publicacionId, Long userId, TipoReaccion tipo) {
        Publicacion publicacion = publicacionRepository.findById(publicacionId)
                .orElseThrow(() -> new NoSuchElementException("Publicación no encontrada"));

        Optional<Reaccion> existente = reaccionRepository.findByUsuarioIdAndPublicacionId(userId, publicacionId);
        if (existente.isPresent()) {
            // Actualizar en la entidad managed evita el DELETE+INSERT que causa StaleObjectStateException
            existente.get().setTipo(tipo);
            existente.get().setFecha(LocalDateTime.now());
        } else {
            Usuario usuario = usuarioRepository.getReferenceById(userId);
            reaccionRepository.save(new Reaccion(usuario, publicacion, tipo, null));
        }

        notificacionService.emitir(publicacion.getUsuario().getId(), userId,
                TipoNotificacion.NUEVA_REACCION_PUBLICACION, publicacionId);
    }

    @Transactional
    public void quitarReaccion(Long publicacionId, Long userId) {
        if (reaccionRepository.findByUsuarioIdAndPublicacionId(userId, publicacionId).isEmpty())
            throw new NoSuchElementException("No existe reacción para eliminar");

        reaccionRepository.deleteByUsuarioIdAndPublicacionId(userId, publicacionId);
    }

    public Page<PublicacionDTO> getFeed(Long userId, int page, int size){
       List<Long> ids = new ArrayList<>(seguimientoRepository.findSeguidosIdsBySeguidorId(userId));
       ids.add(userId);
       Pageable pageable = PageRequest.of(page, size);
       return publicacionRepository.findFeedGlobal(Visibilidad.PUBLICA, Visibilidad.SEGUIDORES, ids, pageable)
               .map(p -> buildDTO(p, userId));
    }


    // --- privado: resuelve visibilidad y delega al mapper ---

    private boolean esVisible(Publicacion p, Long viewerId) {
        Long autorId = p.getUsuario().getId();
        return switch (p.getVisibilidad()) {
            case PUBLICA    -> true;
            case PRIVADA    -> autorId.equals(viewerId);
            case SEGUIDORES -> autorId.equals(viewerId) || usuarioRepository.sigueA(viewerId, autorId);
        };
    }

    private PublicacionDTO buildDTO(Publicacion p, Long viewerId) {
        AutorResumenDTO autor = autorResumenMapper.toDTO(p.getUsuario());

        List<PublicacionImagen> mediaOrdenada = p.getImagenes() == null
            ? List.of()
            : p.getImagenes().stream()
                .sorted(Comparator.comparing(PublicacionImagen::getOrden))
                .toList();

        List<MediaDTO> media = mediaOrdenada.stream()
            .map(m -> new MediaDTO(m.getUrl(), m.getTipo(), m.getOrden() == null ? 0 : m.getOrden()))
            .toList();

        List<String> imagenes = mediaOrdenada.stream()
            .filter(m -> m.getTipo() == null || m.getTipo() == TipoMedia.IMAGEN)
            .map(PublicacionImagen::getUrl)
            .toList();

        TipoReaccion reaccionDelVisor = viewerId != null
                ? publicacionRepository.findReaccionDelVisor(p.getId(), viewerId).orElse(null)
                : null;

        return publicacionMapper.toDTO(
            p, autor, imagenes, media,
                publicacionRepository.countReacciones(p.getId()),
                publicacionRepository.countComentarios(p.getId()),
                reaccionDelVisor
        );
    }
}