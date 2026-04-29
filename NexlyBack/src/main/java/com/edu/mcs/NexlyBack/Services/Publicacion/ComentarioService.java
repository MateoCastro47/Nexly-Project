package com.edu.mcs.NexlyBack.Services.Publicacion;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.edu.mcs.NexlyBack.DTOs.Publicacion.AutorResumenDTO;
import com.edu.mcs.NexlyBack.DTOs.Publicacion.ComentarioDTO;
import com.edu.mcs.NexlyBack.Mappers.Publicacion.AutorResumenMapper;
import com.edu.mcs.NexlyBack.Mappers.Publicacion.ComentarioMapper;
import com.edu.mcs.NexlyBack.Repositories.Publicacion.ComentarioRepository;
import com.edu.mcs.NexlyBack.Repositories.Publicacion.PublicacionRepository;
import com.edu.mcs.NexlyBack.Repositories.Publicacion.ReaccionComentarioRepository;
import com.edu.mcs.NexlyBack.Repositories.Usuario.UsuarioRepository;
import com.edu.mcs.NexlyBack.Services.Notificacion.NotificacionService;
import com.edu.mcs.NexlyBack.models.Comentario;
import com.edu.mcs.NexlyBack.models.Enums.TipoNotificacion;
import com.edu.mcs.NexlyBack.models.Enums.TipoReaccion;
import com.edu.mcs.NexlyBack.models.Publicacion;
import com.edu.mcs.NexlyBack.models.ReaccionComentario;
import com.edu.mcs.NexlyBack.models.Usuario;

@Service
@Transactional(readOnly = true)
public class ComentarioService {

    private final ComentarioRepository comentarioRepository;
    private final ReaccionComentarioRepository reaccionComentarioRepository;
    private final PublicacionRepository publicacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final ComentarioMapper comentarioMapper;
    private final AutorResumenMapper autorResumenMapper;
    private final NotificacionService notificacionService;

    public ComentarioService(ComentarioRepository comentarioRepository,
                             ReaccionComentarioRepository reaccionComentarioRepository,
                             PublicacionRepository publicacionRepository,
                             UsuarioRepository usuarioRepository,
                             ComentarioMapper comentarioMapper,
                             AutorResumenMapper autorResumenMapper,
                             NotificacionService notificacionService) {
        this.comentarioRepository = comentarioRepository;
        this.reaccionComentarioRepository = reaccionComentarioRepository;
        this.publicacionRepository = publicacionRepository;
        this.usuarioRepository = usuarioRepository;
        this.comentarioMapper = comentarioMapper;
        this.autorResumenMapper = autorResumenMapper;
        this.notificacionService = notificacionService;
    }

    public Page<ComentarioDTO> getComentarios(Long publicacionId, Long viewerId, int page, int size) {
        return comentarioRepository.findByPublicacionIdAndComentarioPadreIsNullOrderByFechaCreacionAsc(
            publicacionId, PageRequest.of(page, size))
            .map(c -> buildDTO(c, viewerId));
    }

    public Page<ComentarioDTO> getRespuestas(Long comentarioPadreId, Long viewerId, int page, int size) {
        return comentarioRepository.findByComentarioPadreIdOrderByFechaCreacionAsc(
            comentarioPadreId, PageRequest.of(page, size))
            .map(c -> buildDTO(c, viewerId));
    }

    @Transactional
    public ComentarioDTO comentar(Long publicacionId, Long userId, String contenido, Long comentarioPadreId) {
        Publicacion publicacion = publicacionRepository.findById(publicacionId)
                .orElseThrow(() -> new NoSuchElementException("Publicación no encontrada"));

        if (!publicacion.getComentariosActivos())
            throw new IllegalStateException("Los comentarios están desactivados");

        Usuario autor = usuarioRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));

        Comentario c = new Comentario();
        c.setPublicacion(publicacion);
        c.setUsuario(autor);
        c.setContenido(contenido);

        if (comentarioPadreId != null) {
            Comentario padre = comentarioRepository.findById(comentarioPadreId)
                    .orElseThrow(() -> new NoSuchElementException("Comentario padre no encontrado"));
            c.setComentarioPadre(padre);
        }

        ComentarioDTO dto = buildDTO(comentarioRepository.save(c), userId);

        notificacionService.emitir(publicacion.getUsuario().getId(), userId,
                TipoNotificacion.NUEVO_COMENTARIO, publicacion.getId());

        return dto;
    }

    @Transactional
    public ComentarioDTO editar(Long id, Long userId, String contenido) {
        Comentario c = comentarioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Comentario no encontrado"));

        if (!c.getUsuario().getId().equals(userId))
            throw new IllegalStateException("Sin permiso para editar este comentario");

        c.setContenido(contenido);
        c.setFechaEdicion(LocalDateTime.now());
        return buildDTO(comentarioRepository.save(c), userId);
    }

    @Transactional
    public void eliminar(Long id, Long userId) {
        Comentario c = comentarioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Comentario no encontrado"));

        if (!c.getUsuario().getId().equals(userId))
            throw new IllegalStateException("Sin permiso para eliminar este comentario");

        comentarioRepository.delete(c);
    }

    @Transactional
    public void reaccionar(Long comentarioId, Long userId, TipoReaccion tipo) {
        Comentario comentario = comentarioRepository.findById(comentarioId)
                .orElseThrow(() -> new NoSuchElementException("Comentario no encontrado"));

        reaccionComentarioRepository.findByUsuarioIdAndComentarioId(userId, comentarioId)
                .ifPresent(r -> reaccionComentarioRepository.deleteByUsuarioIdAndComentarioId(userId, comentarioId));

        Usuario usuario = usuarioRepository.getReferenceById(userId);
        reaccionComentarioRepository.save(new ReaccionComentario(usuario, comentario, tipo, null));
    }

    @Transactional
    public void quitarReaccion(Long comentarioId, Long userId) {
        if (reaccionComentarioRepository.findByUsuarioIdAndComentarioId(userId, comentarioId).isEmpty())
            throw new NoSuchElementException("No existe reacción para eliminar");

        reaccionComentarioRepository.deleteByUsuarioIdAndComentarioId(userId, comentarioId);
    }

    // --- privado: resuelve datos calculados y delega al mapper ---

    private ComentarioDTO buildDTO(Comentario c, Long viewerId) {
        AutorResumenDTO autor = autorResumenMapper.toDTO(c.getUsuario());

        TipoReaccion reaccionDelVisor = viewerId != null
                ? comentarioRepository.findReaccionDelVisor(c.getId(), viewerId).orElse(null)
                : null;

        return comentarioMapper.toDTO(
                c, autor,
                comentarioRepository.countByComentarioPadreId(c.getId()),
                comentarioRepository.countReacciones(c.getId()),
                reaccionDelVisor
        );
    }
}
