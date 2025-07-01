package com.rankhwa.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtUtil {
    private Key key;

    @PostConstruct
    void init() {
        String secret = System.getenv("JWT_SECRET");

        if (secret == null || secret.isBlank()) {
            secret = System.getProperty("JWT_SECRET");
        }

        if (secret == null || secret.length() < 32) {
            throw new IllegalStateException(
                    "JWT_SECRET missing or too short (minimum 32 characters)");
        }

        key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Long userId, String email) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(userId.toString())
                .claim("email", email)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(60 * 60 * 24))) // 24h expiration date
                .signWith(key)
                .compact();
    }

    public Long validateAndGetUserId(String token) {
        return Long.valueOf(
                Jwts.parser().setSigningKey(key).build()
                        .parseClaimsJws(token).getBody().getSubject()
        );
    }

}
