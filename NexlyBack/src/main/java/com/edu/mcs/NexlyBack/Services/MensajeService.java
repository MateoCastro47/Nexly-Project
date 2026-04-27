package com.edu.mcs.NexlyBack.Services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.edu.mcs.NexlyBack.DTOs.Mensaje.ConversacionDTO;
import com.edu.mcs.NexlyBack.DTOs.Mensaje.MensajeDTO;
import com.edu.mcs.NexlyBack.DTOs.Mensaje.ParticipanteDTO;
import com.edu.mcs.NexlyBack.Repositories.ConversacionRepository;
import com.edu.mcs.NexlyBack.Repositories.MensajeRepository;
import com.edu.mcs.NexlyBack.Repositories.ParticipanteConversacionRepository;
import com.edu.mcs.NexlyBack.Repositories.UsuarioRepository;
import com.edu.mcs.NexlyBack.models.Conversacion;
import com.edu.mcs.NexlyBack.models.Mensaje;
import com.edu.mcs.NexlyBack.models.ParticipanteConversacion;
import com.edu.mcs.NexlyBack.models.Usuario;

@Service
@Transactional(readOnly = true)
public class MensajeService {
    
    private final ConversacionRepository conversacionRepository;
    private final MensajeRepository mensajeRepository;
    private final ParticipanteConversacionRepository participanteRepository;
    private final UsuarioRepository usuarioRepository;


    public MensajeService(ConversacionRepository conversacionRepository, MensajeRepository mensajeRepository,
            ParticipanteConversacionRepository participanteRepository, UsuarioRepository usuarioRepository) {
        this.conversacionRepository = conversacionRepository;
        this.mensajeRepository = mensajeRepository;
        this.participanteRepository = participanteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<ConversacionDTO> getMisConversaciones(Long userId){
        return conversacionRepository.findByParticipanteId(userId).stream().map(this::toConversacionDTO).toList();
    }

    public List<MensajeDTO> getMensajes(Long conversacionId, Long userId){
        if (!participanteRepository.existsByConversacionIdAndUsuarioId(conversacionId, userId)) {
            throw new IllegalStateException("No eres participante de esta conversacion");
        }
        return mensajeRepository.findByConversacionIdOrderByFechaEnvioAsc(conversacionId).stream().map(this::toMensajeDTO).toList();
    }

    @Transactional
    public ConversacionDTO iniciarDirecta(Long userId, Long otroId){
        return conversacionRepository.findDirecta(userId, otroId).map(this::toConversacionDTO)
        .orElseGet(() -> {
            Conversacion c = new Conversacion();
            c.setEsGrupal(false);
            Conversacion saved = conversacionRepository.save(c);

            agregarParticipante(saved, userId);
            agregarParticipante(saved, otroId);

            return toConversacionDTO(saved);
        });
    }

    @Transactional
    public MensajeDTO enviar(Long conversacionId, Long userId, String contenido){
        if (!participanteRepository.existsByConversacionIdAndUsuarioId(conversacionId, userId)) {
            throw new IllegalStateException("No eres participante de esta conversacion");
        }

        Conversacion c = conversacionRepository.findById(conversacionId).orElseThrow(() -> new NoSuchElementException("Conversacion no encontrada"));
        Usuario autor = usuarioRepository.getReferenceById(userId);
        Mensaje m = new Mensaje();
        m.setConversacion(c);
        m.setRemitente(autor);
        m.setContenido(contenido);

        c.setUltimoMensaje(m.getFechaEnvio() != null ? m.getFechaEnvio() : LocalDateTime.now());
        conversacionRepository.save(c);

        return toMensajeDTO(mensajeRepository.save(m));
    }

    private void agregarParticipante(Conversacion c, Long userId) {
        Usuario u = usuarioRepository.getReferenceById(userId);
        ParticipanteConversacion p = new ParticipanteConversacion();
        p.setConversacion(c);
        p.setUsuario(u);
        participanteRepository.save(p);
    }

    private ConversacionDTO toConversacionDTO(Conversacion c) {
        List<ParticipanteDTO> participantes = participanteRepository
                .findAll().stream()
                .filter(p -> p.getConversacion().getId().equals(c.getId()))
                .map(p -> new ParticipanteDTO(p.getUsuario().getId(),
                        p.getUsuario().getNombreUsuario(),
                        p.getUsuario().getFotoPerfil()))
                .toList();
        return new ConversacionDTO(c.getId(), c.getNombre(), c.getFoto(),
                c.getEsGrupal(), c.getUltimoMensaje(), participantes);
    }

    private MensajeDTO toMensajeDTO(Mensaje m) {
        return new MensajeDTO(m.getId(), m.getRemitente().getId(),
                m.getRemitente().getNombreUsuario(),
                m.getRemitente().getFotoPerfil(),
                m.getContenido(), m.getFechaEnvio());
    }
}
