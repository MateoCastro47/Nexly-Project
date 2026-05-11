import { useEffect, useState } from "react";
import type { Comunidad, Usuario } from "../types";
import { buscarComunidades, buscarUsuarios } from "../api/busqueda";

interface ResultadosBusqueda {
    usuarios: Usuario[]
    comunidades: Comunidad[]
}

export function useBusqueda() {
    const [query, setQuery] = useState('')
    const [resultados, setResultados] = useState<ResultadosBusqueda>({ usuarios: [], comunidades: [] })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(query.trim().length < 2){
            setResultados({usuarios: [], comunidades: []})
            return
        }

        setLoading(true)
        const timer = setTimeout(async () => {
            try{
                const [{data: usuarios}, {data: comunidades}] = await Promise.all([
                    buscarUsuarios(query.trim()),
                    buscarComunidades(query.trim()),
                ])
                setResultados({ usuarios, comunidades})
            }catch{
                setResultados({usuarios: [], comunidades: []})
            } finally{
                setLoading(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    function limpiar(){
        setQuery('')
        setResultados({ usuarios: [], comunidades: []})
    }

    const hayResultados = resultados.usuarios.length > 0 || resultados.comunidades.length > 0
    const sinResultados = !loading && query.trim().length >= 2 && !hayResultados

    return { query, setQuery, resultados, loading, limpiar, hayResultados, sinResultados}
}