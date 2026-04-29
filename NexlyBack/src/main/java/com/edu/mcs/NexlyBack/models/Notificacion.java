package com.edu.mcs.NexlyBack.models;

import com.edu.mcs.NexlyBack.models.Enums.TipoNotificacion;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Notificacion")
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destinatario_id", nullable = false)
    private Usuario destinatario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emisor_id")
    private Usuario emisor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoNotificacion tipo;

    // ID de la entidad relacionada (publicacion, comentario, conversacion...)
    @Column(name = "entidad_id")
    private Long entidadId;

    @Column(nullable = false)
    private Boolean leida = false;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    public Notificacion() {}

    public Notificacion(Usuario destinatario, Usuario emisor,
                        TipoNotificacion tipo, Long entidadId) {
        this.destinatario = destinatario;
        this.emisor = emisor;
        this.tipo = tipo;
        this.entidadId = entidadId;
    }

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        if (this.leida == null) this.leida = false;
    }

    public Long getId() { return id; }
    public Usuario getDestinatario() { return destinatario; }
    public Usuario getEmisor() { return emisor; }
    public TipoNotificacion getTipo() { return tipo; }
    public Long getEntidadId() { return entidadId; }
    public Boolean getLeida() { return leida; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setLeida(Boolean leida) { this.leida = leida; }
}
