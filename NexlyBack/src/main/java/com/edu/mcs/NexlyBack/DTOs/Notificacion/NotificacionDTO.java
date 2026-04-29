package com.edu.mcs.NexlyBack.DTOs.Notificacion;

import com.edu.mcs.NexlyBack.models.Enums.TipoNotificacion;
import java.time.LocalDateTime;

public class NotificacionDTO {

    private Long id;
    private TipoNotificacion tipo;
    private Long entidadId;
    private boolean leida;
    private LocalDateTime fechaCreacion;
    // datos resumidos del emisor
    private Long emisorId;
    private String emisorUsername;
    private String emisorFotoPerfil;

    public NotificacionDTO() {}

    public Long getId() { 
        return id; 
    }

    public void setId(Long id) { 
        this.id = id; 
    }

    public TipoNotificacion getTipo() { 
        return tipo; 
    }
    public void setTipo(TipoNotificacion tipo) { 
        this.tipo = tipo; 
    }

    public Long getEntidadId() { 
        return entidadId; 
    }

    public void setEntidadId(Long entidadId) { 
        this.entidadId = entidadId; 
    }

    public boolean isLeida() { 
        return leida; 
    }

    public void setLeida(boolean leida) { 
        this.leida = leida; 
    }

    public LocalDateTime getFechaCreacion() { 
        return fechaCreacion; 
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) { 
        this.fechaCreacion = fechaCreacion; 
    }

    public Long getEmisorId() { 
        return emisorId; 
    }

    public void setEmisorId(Long emisorId) { 
        this.emisorId = emisorId; 
    }

    public String getEmisorUsername() { 
        return emisorUsername; 
    }

    public void setEmisorUsername(String emisorUsername) { 
        this.emisorUsername = emisorUsername; 
    }

    public String getEmisorFotoPerfil() { 
        return emisorFotoPerfil; 
    }

    public void setEmisorFotoPerfil(String emisorFotoPerfil) { 
        this.emisorFotoPerfil = emisorFotoPerfil; 
    }
}
