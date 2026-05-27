package com.edu.mcs.NexlyBack.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Token de un solo uso para verificar la dirección de correo de un usuario
 * tras el registro. Se envía por email dentro de un enlace y caduca a las
 * 24 horas. Una vez usado (o caducado) se elimina.
 */
@Entity
@Table(name = "TokenVerificacion")
public class TokenVerificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "fecha_expiracion", nullable = false)
    private LocalDateTime fechaExpiracion;

    public TokenVerificacion() {
    }

    public TokenVerificacion(String token, Usuario usuario, LocalDateTime fechaExpiracion) {
        this.token = token;
        this.usuario = usuario;
        this.fechaExpiracion = fechaExpiracion;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public LocalDateTime getFechaExpiracion() {
        return fechaExpiracion;
    }

    public void setFechaExpiracion(LocalDateTime fechaExpiracion) {
        this.fechaExpiracion = fechaExpiracion;
    }

    public boolean estaCaducado() {
        return fechaExpiracion.isBefore(LocalDateTime.now());
    }
}
