package com.edu.mcs.NexlyBack.DTOs;

public class UsuarioDTO {
    private Long id;
    private String nombreCompleto;
    private String nombreUsuario;
    private String fotoPerfil;
    private String fotoPortada;
    private String biografia;
    private String enlaceWeb;
    private String ubicacion;
    private long seguidores;
    private long seguidos;
    private long publicaciones;

    // Estado relacional respecto al usuario autenticado
    private boolean teSigue;
    private boolean loSigues;
    private boolean estaBloqueado;   // tú lo bloqueaste
    private boolean teBloqueo;   // él te bloqueó

    public UsuarioDTO(String biografia, String enlaceWeb, boolean estaBloqueado, String fotoPerfil, String fotoPortada, Long id, boolean loSigues, String nombreCompleto, String nombreUsuario, long publicaciones, long seguidores, long seguidos, boolean teBloqueo, boolean teSigue, String ubicacion) {
        this.biografia = biografia;
        this.enlaceWeb = enlaceWeb;
        this.estaBloqueado = estaBloqueado;
        this.fotoPerfil = fotoPerfil;
        this.fotoPortada = fotoPortada;
        this.id = id;
        this.loSigues = loSigues;
        this.nombreCompleto = nombreCompleto;
        this.nombreUsuario = nombreUsuario;
        this.publicaciones = publicaciones;
        this.seguidores = seguidores;
        this.seguidos = seguidos;
        this.teBloqueo = teBloqueo;
        this.teSigue = teSigue;
        this.ubicacion = ubicacion;
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

    public long getSeguidores() {
        return seguidores;
    }

    public void setSeguidores(long seguidores) {
        this.seguidores = seguidores;
    }

    public long getSeguidos() {
        return seguidos;
    }

    public void setSeguidos(long seguidos) {
        this.seguidos = seguidos;
    }

    public long getPublicaciones() {
        return publicaciones;
    }

    public void setPublicaciones(long publicaciones) {
        this.publicaciones = publicaciones;
    }

    public boolean isTeSigue() {
        return teSigue;
    }

    public void setTeSigue(boolean teSigue) {
        this.teSigue = teSigue;
    }

    public boolean isLoSigues() {
        return loSigues;
    }

    public void setLoSigues(boolean loSigues) {
        this.loSigues = loSigues;
    }

    public boolean isEstaBloqueado() {
        return estaBloqueado;
    }

    public void setEstaBloqueado(boolean estaBloqueado) {
        this.estaBloqueado = estaBloqueado;
    }

    public boolean isTeBloqueo() {
        return teBloqueo;
    }

    public void setTeBloqueo(boolean teBloqueo) {
        this.teBloqueo = teBloqueo;
    }


}
