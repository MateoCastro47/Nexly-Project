package com.edu.mcs.NexlyBack.models;

import com.edu.mcs.NexlyBack.models.Enums.Rol;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_completo", nullable = false, length = 100)
    private String nombreCompleto;

    @Column(name = "nombre_usuario", nullable = false, unique = true, length = 50)
    private String nombreUsuario;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(length = 20)
    private String telefono;

    @Column(name = "contrasena_hash")
    private String contrasenaHash;

    @Column(name = "foto_perfil")
    private String fotoPerfil;

    @Column(name = "foto_portada")
    private String fotoPortada;

    @Column(columnDefinition = "TEXT")
    private String biografia;

    @Column(name = "enlace_web")
    private String enlaceWeb;

    @Column(length = 100)
    private String ubicacion;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol = Rol.USER;

    @Column(name = "perfil_privado", nullable = false)
    private Boolean perfilPrivado = false;

    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "proveedor_oauth", length = 20)
    private String proveedorOAuth;

    @Column(name = "oauth_id")
    private String oauthId;

    @Column(name = "onboarding_completado", nullable = false)
    private Boolean onboardingCompletado = false;

    @OneToMany(mappedBy = "seguidor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Seguimiento> seguidores;

    @OneToMany(mappedBy = "seguido", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Seguimiento> seguidos;

    @OneToMany(mappedBy = "bloqueador", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Bloqueo> bloqueos;

    @OneToMany(mappedBy = "bloqueado", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Bloqueo> bloqueados;

    @OneToMany(mappedBy = "creador", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Comunidad> comunidadesCreadas;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Publicacion> publicaciones;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Reaccion> reacciones;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Comentario> comentarios;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ReaccionComentario> reaccionesComentarios;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<MiembroComunidad> membresias;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ParticipanteConversacion> conversaciones;

    @OneToMany(mappedBy = "remitente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Mensaje> mensajesEnviados;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<MensajeLeido> mensajesLeidos;

    public Usuario() {
    }

    public Usuario(Long id, String nombreCompleto, String nombreUsuario, String email, String telefono,
                   String contrasenaHash, String fotoPerfil, String fotoPortada, String biografia,
                   String enlaceWeb, String ubicacion, LocalDate fechaNacimiento, Rol rol,
                   Boolean perfilPrivado, LocalDateTime fechaRegistro, Boolean activo,
                   List<Seguimiento> seguidores, List<Seguimiento> seguidos, List<Bloqueo> bloqueos,
                   List<Bloqueo> bloqueados, List<Comunidad> comunidadesCreadas,
                   List<Publicacion> publicaciones, List<Reaccion> reacciones,
                   List<Comentario> comentarios, List<ReaccionComentario> reaccionesComentarios,
                   List<MiembroComunidad> membresias,
                   List<ParticipanteConversacion> conversaciones, List<Mensaje> mensajesEnviados,
                   List<MensajeLeido> mensajesLeidos) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.nombreUsuario = nombreUsuario;
        this.email = email;
        this.telefono = telefono;
        this.contrasenaHash = contrasenaHash;
        this.fotoPerfil = fotoPerfil;
        this.fotoPortada = fotoPortada;
        this.biografia = biografia;
        this.enlaceWeb = enlaceWeb;
        this.ubicacion = ubicacion;
        this.fechaNacimiento = fechaNacimiento;
        this.rol = rol;
        this.perfilPrivado = perfilPrivado;
        this.fechaRegistro = fechaRegistro;
        this.activo = activo;
        this.seguidores = seguidores;
        this.seguidos = seguidos;
        this.bloqueos = bloqueos;
        this.bloqueados = bloqueados;
        this.comunidadesCreadas = comunidadesCreadas;
        this.publicaciones = publicaciones;
        this.reacciones = reacciones;
        this.comentarios = comentarios;
        this.reaccionesComentarios = reaccionesComentarios;
        this.membresias = membresias;
        this.conversaciones = conversaciones;
        this.mensajesEnviados = mensajesEnviados;
        this.mensajesLeidos = mensajesLeidos;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getContrasenaHash() {
        return contrasenaHash;
    }

    public void setContrasenaHash(String contrasenaHash) {
        this.contrasenaHash = contrasenaHash;
    }

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    public String getFotoPortada() {
        return fotoPortada;
    }

    public void setFotoPortada(String fotoPortada) {
        this.fotoPortada = fotoPortada;
    }

    public String getBiografia() {
        return biografia;
    }

    public void setBiografia(String biografia) {
        this.biografia = biografia;
    }

    public String getEnlaceWeb() {
        return enlaceWeb;
    }

    public void setEnlaceWeb(String enlaceWeb) {
        this.enlaceWeb = enlaceWeb;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public Boolean getPerfilPrivado() {
        return perfilPrivado;
    }

    public void setPerfilPrivado(Boolean perfilPrivado) {
        this.perfilPrivado = perfilPrivado;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public List<Seguimiento> getSeguidores() {
        return seguidores;
    }

    public void setSeguidores(List<Seguimiento> seguidores) {
        this.seguidores = seguidores;
    }

    public List<Seguimiento> getSeguidos() {
        return seguidos;
    }

    public void setSeguidos(List<Seguimiento> seguidos) {
        this.seguidos = seguidos;
    }

    public List<Bloqueo> getBloqueos() {
        return bloqueos;
    }

    public void setBloqueos(List<Bloqueo> bloqueos) {
        this.bloqueos = bloqueos;
    }

    public List<Bloqueo> getBloqueados() {
        return bloqueados;
    }

    public void setBloqueados(List<Bloqueo> bloqueados) {
        this.bloqueados = bloqueados;
    }

    public List<Comunidad> getComunidadesCreadas() {
        return comunidadesCreadas;
    }

    public void setComunidadesCreadas(List<Comunidad> comunidadesCreadas) {
        this.comunidadesCreadas = comunidadesCreadas;
    }

    public List<Publicacion> getPublicaciones() {
        return publicaciones;
    }

    public void setPublicaciones(List<Publicacion> publicaciones) {
        this.publicaciones = publicaciones;
    }

    public List<Reaccion> getReacciones() {
        return reacciones;
    }

    public void setReacciones(List<Reaccion> reacciones) {
        this.reacciones = reacciones;
    }

    public List<Comentario> getComentarios() {
        return comentarios;
    }

    public void setComentarios(List<Comentario> comentarios) {
        this.comentarios = comentarios;
    }

    public List<ReaccionComentario> getReaccionesComentarios() {
        return reaccionesComentarios;
    }

    public void setReaccionesComentarios(List<ReaccionComentario> reaccionesComentarios) {
        this.reaccionesComentarios = reaccionesComentarios;
    }

    public List<MiembroComunidad> getMembresias() {
        return membresias;
    }

    public void setMembresias(List<MiembroComunidad> membresias) {
        this.membresias = membresias;
    }

    public List<ParticipanteConversacion> getConversaciones() {
        return conversaciones;
    }

    public void setConversaciones(List<ParticipanteConversacion> conversaciones) {
        this.conversaciones = conversaciones;
    }

    public List<Mensaje> getMensajesEnviados() {
        return mensajesEnviados;
    }

    public void setMensajesEnviados(List<Mensaje> mensajesEnviados) {
        this.mensajesEnviados = mensajesEnviados;
    }

    public List<MensajeLeido> getMensajesLeidos() {
        return mensajesLeidos;
    }

    public void setMensajesLeidos(List<MensajeLeido> mensajesLeidos) {
        this.mensajesLeidos = mensajesLeidos;
    }

    
    public String getProveedorOAuth() {
        return proveedorOAuth;
    }

    public void setProveedorOAuth(String proveedorOAuth) {
        this.proveedorOAuth = proveedorOAuth;
    }

    public String getOauthId() {
        return oauthId;
    }

    public void setOauthId(String oauthId) {
        this.oauthId = oauthId;
    }

    public Boolean getOnboardingCompletado() {
        return onboardingCompletado;
    }

    public void setOnboardingCompletado(Boolean onboardingCompletado) {
        this.onboardingCompletado = onboardingCompletado;
    }

    @PrePersist
    protected void onCreate() {
        this.fechaRegistro = LocalDateTime.now();
        if (this.rol == null) this.rol = Rol.USER;
        if (this.perfilPrivado == null) this.perfilPrivado = false;
        if (this.activo == null) this.activo = true;
        if (this.onboardingCompletado == null) this.onboardingCompletado = false;
    }
}
