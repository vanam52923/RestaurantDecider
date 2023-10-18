package com.restaurantserver.restaurantbackend.service.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

/**
        * The `WebSocketConfig` class is responsible for configuring WebSocket communication in the Spring Boot application.
        * It enables WebSocket support and Stomp-based messaging for real-time interaction.
        *
        * @Configuration Indicates that this class provides configuration for the Spring application.
        * @EnableWebSocketMessageBroker Enables WebSocket message broker support.
        */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private Logger logger= LoggerFactory.getLogger(WebSocketConfig.class);


    /**
     * Registers Stomp endpoints for WebSocket communication, allowing clients to connect to the WebSocket.
     *
     * @param registry The Stomp endpoint registry for WebSocket endpoints.
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        logger.info("Resgister Stomp End points");
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }


    /**
     * Configures message broker options for WebSocket communication.
     *
     * @param registry The message broker registry for WebSocket.
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) { 
       logger.info("Configure brokers");
       registry.setApplicationDestinationPrefixes("/app");
       registry.enableSimpleBroker("/chatroom","/user","/restaurant");
       registry.setUserDestinationPrefix("/user");
    }

    /**
     * Configures WebSocket transport options.
     *
     * @param registry The WebSocket transport registration to configure transport settings.
     */
    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registry) {
        registry.setSendTimeLimit(60 * 1000)
                .setSendBufferSizeLimit(50 * 1024 * 1024)
                .setMessageSizeLimit(50 * 1024 * 1024);
    }
}
