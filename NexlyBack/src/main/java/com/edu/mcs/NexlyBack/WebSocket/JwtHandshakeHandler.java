package com.edu.mcs.NexlyBack.WebSocket;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

@Component
public class JwtHandshakeHandler extends DefaultHandshakeHandler{
    
    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> atributes){
        Object p = atributes.get(JwtHandShakeInterceptor.PRINCIPAL_ATTR);
        return (p instanceof Principal principal) ? principal : null;
    }
}
