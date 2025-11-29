package com.tunistudent.gateway;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        
        // Log for debugging
        System.out.println("🔐 Gateway processing request to: " + request.getPath());
        
        if (request.getHeaders().containsKey("Authorization")) {
            String authHeader = request.getHeaders().getFirst("Authorization");
            System.out.println("✅ Authorization header present: " + (authHeader != null ? authHeader.substring(0, Math.min(20, authHeader.length())) + "..." : "null"));
        } else {
            System.out.println("⚠️ No Authorization header found");
        }
        
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -1; // Highest priority
    }
}
