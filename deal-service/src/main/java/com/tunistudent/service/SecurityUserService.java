package com.tunistudent.service;

import com.tunistudent.model.User;
import com.tunistudent.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class SecurityUserService {
    private final UserRepository userRepository;

    public SecurityUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUserOrThrow() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.UNAUTHORIZED, "No authenticated user"
            );
        }

        // Extract username from Keycloak JWT
        final String username;
        final String email;
        final java.util.Set<String> roles = new java.util.HashSet<>();

        if (auth.getPrincipal() instanceof org.springframework.security.oauth2.jwt.Jwt) {
            org.springframework.security.oauth2.jwt.Jwt jwt = (org.springframework.security.oauth2.jwt.Jwt) auth.getPrincipal();
            username = jwt.getClaimAsString("preferred_username");
            email = jwt.getClaimAsString("email");
            
            // Extract roles from realm_access
            var realmAccess = jwt.getClaimAsMap("realm_access");
            if (realmAccess != null && realmAccess.containsKey("roles")) {
                @SuppressWarnings("unchecked")
                java.util.List<String> realmRoles = (java.util.List<String>) realmAccess.get("roles");
                for (String role : realmRoles) {
                    roles.add("ROLE_" + role.toUpperCase());
                }
            }
        } else {
            username = auth.getName();
            email = null;
            // Extract roles from authorities
            auth.getAuthorities().forEach(a -> roles.add(a.getAuthority()));
        }

        if (username == null) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.UNAUTHORIZED, "No username in authentication"
            );
        }

        // Find or create shadow user
        return userRepository.findByUsername(username)
            .orElseGet(() -> {
                User newUser = User.builder()
                        .username(username)
                        .email(email != null ? email : username + "@keycloak.local")
                        .password("") // Password managed by Keycloak
                        .roles(roles)
                        .build();
                return userRepository.save(newUser);
            });
    }
}
