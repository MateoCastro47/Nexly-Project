package com.edu.mcs.NexlyBack.Security;

import com.edu.mcs.NexlyBack.Repositories.Usuario.UsuarioRepository;
import com.edu.mcs.NexlyBack.models.Usuario;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    private final UsuarioRepository usuarioRepository;

    public UserDetailsServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        Usuario u = usuarioRepository.findByEmail(email)
                .filter(Usuario::getActivo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        if (u.getContrasenaHash() == null) {
            throw new UsernameNotFoundException("Esta cuenta usa inicio de sesión con Google");
        }

        boolean emailVerificado = Boolean.TRUE.equals(u.getEmailVerificado());

        // enabled = email verificado: si es false, DaoAuthenticationProvider
        // lanza DisabledException y el login se bloquea hasta confirmar el correo.
        return new User(
            u.getId().toString(),
            u.getContrasenaHash(),
            emailVerificado,   // enabled
            true,              // accountNonExpired
            true,              // credentialsNonExpired
            true,              // accountNonLocked
            List.of(new SimpleGrantedAuthority("ROLE_" + u.getRol().name()))
        );
    }
}
