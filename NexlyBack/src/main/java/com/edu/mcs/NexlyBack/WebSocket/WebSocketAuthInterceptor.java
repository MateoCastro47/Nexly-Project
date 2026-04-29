package com.edu.mcs.NexlyBack.WebSocket;

import java.util.List;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import com.edu.mcs.NexlyBack.Security.JwtUtil;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor{
    
    private final JwtUtil jwtUtil;

    public WebSocketAuthInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel){
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String header = accessor.getFirstNativeHeader("Authorization");
            if (header == null || !header.startsWith("Bearer ")) {
                throw new MessageDeliveryException("Token ausente o malformado");
            }
            String token = header.substring(7);
            if (!jwtUtil.isValid(token)) {
                throw new MessageDeliveryException("Token inválido o expirado");
            }
            Long userId = jwtUtil.extractUserId(token);
            String rol = jwtUtil.extractRol(token);
            var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + rol));
            var auth = new UsernamePasswordAuthenticationToken(userId, null, authorities);
            accessor.setUser(auth);
        }
        return message;
    }
}
