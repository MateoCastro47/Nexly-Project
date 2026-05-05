package com.edu.mcs.NexlyBack.DTOs.Publicacion;

import com.edu.mcs.NexlyBack.models.Enums.TipoMedia;

public class MediaDTO {
    private String url;
    private TipoMedia tipo;
    private short orden;

    public MediaDTO() {
    }

    public MediaDTO(String url, TipoMedia tipo, short orden) {
        this.url = url;
        this.tipo = tipo;
        this.orden = orden;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public TipoMedia getTipo() {
        return tipo;
    }

    public void setTipo(TipoMedia tipo) {
        this.tipo = tipo;
    }

    public short getOrden() {
        return orden;
    }

    public void setOrden(short orden) {
        this.orden = orden;
    }
}
