package com.edu.mcs.NexlyBack.Services;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.edu.mcs.NexlyBack.DTOs.Mensaje.ConversacionDTO;
import com.edu.mcs.NexlyBack.DTOs.Mensaje.MensajeDTO;
import com.edu.mcs.NexlyBack.DTOs.Mensaje.ParticipanteDTO;
import com.edu.mcs.NexlyBack.Repositories.ConversacionRepository;
import com.edu.mcs.NexlyBack.Repositories.MensajeLeidoRepository;
import com.edu.mcs.NexlyBack.Repositories.MensajeRepository;
import com.edu.mcs.NexlyBack.Repositories.ParticipanteConversacionRepository;
import com.edu.mcs.NexlyBack.Repositories.UsuarioRepository;
import com.edu.mcs.NexlyBack.models.Conversacion;
import com.edu.mcs.NexlyBack.models.Mensaje;
import com.edu.mcs.NexlyBack.models.MensajeLeido;
import com.edu.mcs.NexlyBack.models.ParticipanteConversacion;
import com.edu.mcs.NexlyBack.models.Usuario;

@Service
@Transactional(readOnly = true)
public class MensajeService {

    private final ConversacionRepository conversacionRepository;
    private final MensajeLeidoRepository mensajeLeidoRepository;
    private final MensajeRepository mensajeRepository;
    private final ParticipanteConversacionRepository participanteRepository;
    private final UsuarioRepository usuarioRepository;

    public MensajeService(ConversacionRepository conversacionRepository, MensajeLeidoRepository mensajeLeidoRepository,
            MensajeRepository mensajeRepository, ParticipanteConversacionRepository participanteRepository,
            UsuarioRepository usuarioRepository) {
        this.conversacionRepository = conversacionRepository;
        this.mensajeLeidoRepository = mensajeLeidoRepository;
        this.mensajeRepository = mensajeRepository;
        this.participanteRepository = participanteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<ConversacionDTO> getMisConversaciones(Long userId) {
        return conversacionRepository.findByParticipanteId(userId)
                .stream()
                .map(c -> toConversacionDTO(c, userId))
                .toList();
    }

    public Page<MensajeDTO> getMensajes(Long conversacionId, Long userId, int page, int size) {
        if (!participanteRepository.existsByConversacionIdAndUsuarioId(conversacionId, userId))
            throw new IllegalStateException("No eres participante de esta conversacion");
        return mensajeRepository
                .findByConversacionIdOrderByFechaEnvioDesc(conversacionId, PageRequest.of(page, size))
                .map(this::toMensajeDTO);
    }

    @Transactional
    public ConversacionDTO iniciarDirecta(Long userId, Long otroId) {
        return conversacionRepository.findDirecta(userId, otroId)
                .map(c -> toConversacionDTO(c, userId))
                .orElseGet(() -> {
                    Conversacion c = new Conversacion();
                    c.setEsGrupal(false);
                    Conversacion saved = conversacionRepository.save(c);
                    agregarParticipante(saved, userId);
                    agregarParticipante(saved, otroId);
                    return toConversacionDTO(saved, userId);
                });
    }

    @Transactional
    public void marcarLeidos(Long conversacionId, Long userId) {
        if (!participanteRepository.existsByConversacionIdAndUsuarioId(conversacionId, userId))
            throw new IllegalStateException("No eres participante de esta conversacion");
        Usuario usuario = usuarioRepository.getReferenceById(userId);
        mensajeRepository.findByConversacionIdOrderByFechaEnvioAsc(conversacionId)
                .stream()
                .filter(m -> !m.getRemitente().getId().equals(userId))
                .filter(m -> !mensajeLeidoRepository.existsByMensajeIdAndUsuarioId(m.getId(), userId))
                .forEach(m -> mensajeLeidoRepository.save(new MensajeLeido(m, usuario, null)));
    }

    @Transactional
    public MensajeDTO enviar(Long conversacionId, Long userId, String contenido) {
        if (!participanteRepository.existsByConversacionIdAndUsuarioId(conversacionId, userId))
            throw new IllegalStateException("No eres participante de esta conversacion");

        Conversacion c = conversacionRepository.findById(conversacionId)
                .orElseThrow(() -> new NoSuchElementException("Conversacion no encontrada"));

        Mensaje m = new Mensaje();
        m.setConversacion(c);
        m.setRemitente(usuarioRepository.getReferenceById(userId));
        m.setContenido(contenido);
        Mensaje saved = mensajeRepository.save(m); // @PrePersist asigna fechaEnvio aquí

        c.setUltimoMensaje(saved.getFechaEnvio());
        conversacionRepository.save(c);

        return toMensajeDTO(saved);
    }

    @Transactional
    public ConversacionDTO crearGrupo(Long creadorId, String nombre, List<Long> participanteIds) {
        Conversacion conv = new Conversacion();
        conv.setNombre(nombre);
        conv.setEsGrupal(true);
        conv = conversacionRepository.save(conv);

        List<Long> todos = new ArrayList<>(participanteIds);
        if (!todos.contains(creadorId)) todos.add(creadorId);

        for (Long uid : todos) {
            ParticipanteConversacion p = new ParticipanteConversacion();
            p.setConversacion(conv);
            p.setUsuario(usuarioRepository.getReferenceById(uid));
            participanteRepository.save(p);
        }
        return toConversacionDTO(conv, creadorId);
    }

    private void agregarParticipante(Conversacion c, Long userId) {
        ParticipanteConversacion p = new ParticipanteConversacion();
        p.setConversacion(c);
        p.setUsuario(usuarioRepository.getReferenceById(userId));
        participanteRepository.save(p);
    }

    private ConversacionDTO toConversacionDTO(Conversacion c, Long viewerId) {
        List<ParticipanteDTO> participantes = participanteRepository
                .findByConversacionId(c.getId())
                .stream()
                .map(p -> new ParticipanteDTO(p.getUsuario().getId(),
                        p.getUsuario().getNombreUsuario(),
                        p.getUsuario().getFotoPerfil()))
                .toList();

        String preview = mensajeRepository
                .findTopByConversacionIdOrderByFechaEnvioDesc(c.getId())
                .map(Mensaje::getContenido)
                .orElse(null);

        long noLeidos = mensajeLeidoRepository
                .countUnreadByConversacionIdAndUsuarioId(c.getId(), viewerId);

        return new ConversacionDTO(c.getId(), c.getNombre(), c.getFoto(),
                c.getEsGrupal(), c.getUltimoMensaje(), preview, noLeidos, participantes);
    }

    private MensajeDTO toMensajeDTO(Mensaje m) {
        return new MensajeDTO(m.getId(), m.getRemitente().getId(),
                m.getRemitente().getNombreUsuario(),
                m.getRemitente().getFotoPerfil(),
                m.getContenido(), m.getFechaEnvio());
    }
}