package com.edu.mcs.NexlyBack.WebSocket;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import com.edu.mcs.NexlyBack.Security.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtHandShakeInterceptor implements HandshakeInterceptor{
    public static final String PRINCIPAL_ATTR = "ws.principal";

    private final JwtUtil jwtUtil;
    private final String cookieName;

    public JwtHandShakeInterceptor(JwtUtil jwtUtil,
                                   @Value("${app.auth.cookie-name}") String cookieName){
        this.jwtUtil = jwtUtil;
        this.cookieName = cookieName;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> atributes){
        if (!(request instanceof ServletServerHttpRequest servletReq))  {
            return false;
        }

        HttpServletRequest http = servletReq.getServletRequest();

        Cookie[] cookies = http.getCookies();
        if (cookies == null) {
            return false;
        }

        String token = null;
        for (Cookie c : cookies){
            if (cookieName.equals(c.getName())) {
                token = c.getValue();
                break;
            }
        }
        if (token == null || !jwtUtil.isValid(token)) {
            return false;
        }

        Long userId = jwtUtil.extractUserId(token);
        String rol = jwtUtil.extractRol(token);

        var auth = new UsernamePasswordAuthenticationToken(userId, null, List.of(new SimpleGrantedAuthority("ROLE_" + rol)));

        atributes.put(PRINCIPAL_ATTR, auth);
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception){}
}
