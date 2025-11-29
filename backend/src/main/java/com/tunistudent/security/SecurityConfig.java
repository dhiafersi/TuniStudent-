package com.tunistudent.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.stream.Collectors;

import java.util.List;

@Configuration
@EnableMethodSecurity
@Order(1)
public class SecurityConfig {

    @Value("${app.cors.allowed-origins:*}")
    private String allowedOrigins;

    @Value("${app.cors.allowed-origin-patterns:*}")
    private String allowedOriginPatterns;

    @Bean
    @Order(1)
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(c -> {}) // use the CorsConfigurationSource bean below
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Public auth + docs
                .requestMatchers(
                    "/api/auth/**",
                    "/api/debug/**",
                    "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html"
                ).permitAll()

                // Preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Public READ endpoints
                .requestMatchers(HttpMethod.GET,
                    "/api/deals/**",
                    "/api/cities/**",
                    "/api/categories/**",
                    "/api/ratings/**",
                    "/api/comments/**"
                ).permitAll()

                // Student actions (must be logged in)
                .requestMatchers(HttpMethod.POST,   "/api/ratings/**", "/api/favorites/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/favorites/**").authenticated()
                
                // Deal submission (authenticated users can submit)
                .requestMatchers(HttpMethod.POST,   "/api/deals/submit").authenticated()

                // Admin-only CRUD
                .requestMatchers(HttpMethod.POST,   "/api/deals", "/api/categories/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/api/deals/**", "/api/categories/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/deals/**", "/api/categories/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST,   "/api/deals/*/approve", "/api/deals/*/reject").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET,    "/api/deals/pending").hasRole("ADMIN")
                
                // Admin chat endpoints
                .requestMatchers("/api/admin/chat/**").hasRole("ADMIN")

                // Everything else requires auth
                .anyRequest().authenticated()
            )
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())));

        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("realm_access"); // Keycloak specific
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwt -> {
            var authorities = grantedAuthoritiesConverter.convert(jwt);
            // Extract roles from nested realm_access.roles
            var realmAccess = jwt.getClaimAsMap("realm_access");
            if (realmAccess != null && realmAccess.containsKey("roles")) {
                @SuppressWarnings("unchecked")
                var roles = (List<String>) realmAccess.get("roles");
                return roles.stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                        .collect(Collectors.toList());
            }
            return authorities;
        });
        return jwtAuthenticationConverter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        // Accept any origin via patterns as well
        configuration.setAllowedOriginPatterns(List.of(allowedOriginPatterns.split(",")));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
