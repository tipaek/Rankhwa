package com.rankhwa.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtUtil {
    private final Key key = Keys.hmacShaKeyFor(
            System.getProperty("JWT_SECRET").getBytes());

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
