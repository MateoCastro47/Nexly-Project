import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useEffect } from "react";
import client from "../../api/client";
import type { Usuario } from "../../types";

export default function OAuth2CallBack() {
    const navigate = useNavigate()
    const setUsuario = useAuthStore((s) => s.setUsuario)

    useEffect(() => {
        //El servidor ya estableció la cookie HttpOnly en el redirect
        // Solo necesitamos obtener el perfil del usuario.
        client.get<Usuario>('/usuario/me')
            .then(({data}) => {setUsuario(data); navigate('/')})
            .catch(() => navigate('/login'))
    }, [])

    return(
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg' }}>
            <p style={{ color: 'var(--color-muted)'}}>Iniciando sesión con Google...</p>
        </div>
    )
}