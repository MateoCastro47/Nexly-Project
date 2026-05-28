package com.edu.mcs.NexlyBack.WebSocket;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;


@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{


    private final JwtHandShakeInterceptor jwtHandShakeInterceptor;
    private final JwtHandshakeHandler jwtHandshakeHandler;

    @Value("${app.cors.allowed-origins}")
    private String[] allowedOrigins;

    public WebSocketConfig(JwtHandShakeInterceptor jwtHandShakeInterceptor, JwtHandshakeHandler jwtHandshakeHandler) {
        this.jwtHandShakeInterceptor = jwtHandShakeInterceptor;
        this.jwtHandshakeHandler = jwtHandshakeHandler;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config){
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry){
        registry.addEndpoint("/ws")
            .setAllowedOriginPatterns(allowedOrigins)
            .setHandshakeHandler(jwtHandshakeHandler)
            .addInterceptors(jwtHandShakeInterceptor)
            .withSockJS();
    }
}