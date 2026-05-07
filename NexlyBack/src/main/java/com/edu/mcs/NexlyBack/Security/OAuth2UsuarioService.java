package com.edu.mcs.NexlyBack.Security;

import com.edu.mcs.NexlyBack.Repositories.Usuario.UsuarioRepository;
import com.edu.mcs.NexlyBack.models.Usuario;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OAuth2UsuarioService extends DefaultOAuth2UserService{
    
    private final UsuarioRepository usuarioRepository;

    public OAuth2UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException{
        OAuth2User oAuth2User = super.loadUser(request);

        String email = oAuth2User.getAttribute("email");
        String nombre = oAuth2User.getAttribute("name");
        String fotoPerfil = oAuth2User.getAttribute("picture");
        String oauthId = oAuth2User.getAttribute("sub");
        String proveedor = request.getClientRegistration().getRegistrationId().toUpperCase();

        Usuario usuario = usuarioRepository.findByEmail(email)
                .map((Usuario u) -> actualizarDesdeOAuth(u, fotoPerfil, proveedor, oauthId))
                .orElseGet(() -> crearDesdeOAuth(email, nombre, fotoPerfil, proveedor, oauthId));

        Map<String, Object> attrs = new HashMap<>(oAuth2User.getAttributes());
        attrs.put("userId", usuario.getId());

        return new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name())),
                attrs,
                "email"
        );
    }

    private Usuario actualizarDesdeOAuth(Usuario u, String fotoPerfil, String proveedor, String oauthId) {
        if (fotoPerfil != null && u.getFotoPerfil() == null) {
            u.setFotoPerfil(fotoPerfil);
        }
        if (u.getProveedorOAuth() == null) {
            u.setProveedorOAuth(proveedor);
            u.setOauthId(oauthId);
        }
        return usuarioRepository.save(u);
    }

    private Usuario crearDesdeOAuth(String email, String nombre, String fotoPerfil,
                                     String proveedor, String oauthId) {
        Usuario u = new Usuario();
        u.setEmail(email);
        u.setNombreCompleto(nombre != null ? nombre : email);
        u.setNombreUsuario(generarUsername(email));
        u.setFotoPerfil(fotoPerfil);
        u.setProveedorOAuth(proveedor);
        u.setOauthId(oauthId);
        return usuarioRepository.save(u);
    }

    private String generarUsername(String email) {
        String base = email.split("@")[0].replaceAll("[^a-zA-Z0-9_]", "");
        String candidate = base;
        int i = 1;
        while (usuarioRepository.existsByNombreUsuario(candidate)) {
            candidate = base + i++;
        }
        return candidate;
    }
}
