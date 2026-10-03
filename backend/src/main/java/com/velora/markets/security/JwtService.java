package com.velora.markets.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(
        @Value("${velora.jwt.secret:velora-markets-super-secure-production-jwt-key-32chars}") String secret,
        @Value("${velora.jwt.expiration-ms:86400000}") long expirationMs
    ) {
        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < 32) {
            try {
                java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
                bytes = md.digest(bytes);
            } catch (Exception e) {
                bytes = pad(bytes);
            }
        }
        this.key = Keys.hmacShaKeyFor(bytes);
        this.expirationMs = expirationMs;
    }

    private byte[] pad(byte[] input) {
        byte[] out = new byte[32];
        System.arraycopy(input, 0, out, 0, Math.min(input.length, 32));
        return out;
    }

    public String generateToken(UserPrincipal principal) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
            .subject(principal.getUsername())
            .claim("uid", principal.getId())
            .claim("role", principal.getUser().getRole().name())
            .issuedAt(now)
            .expiration(expiry)
            .signWith(key)
            .compact();
    }

    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isValid(String token, UserPrincipal principal) {
        String email = extractEmail(token);
        return email.equalsIgnoreCase(principal.getUsername()) && !isExpired(token);
    }

    private boolean isExpired(String token) {
        return parseClaims(token).getExpiration().before(new Date());
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
