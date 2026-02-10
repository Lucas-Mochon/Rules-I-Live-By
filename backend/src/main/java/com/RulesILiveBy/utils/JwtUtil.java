package com.RulesILiveBy.utils;

import java.util.Date;

import javax.crypto.SecretKey;

import com.RulesILiveBy.entity.User;

import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JwtUtil {
    private final Dotenv dotenv = Dotenv.load();

    public String generateJwtToken(User user) {
        SecretKey key = Keys.hmacShaKeyFor(dotenv.get("SECRET_KEY").getBytes());

        return Jwts.builder()
                .subject(user.getId())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(key)
                .compact();
    }
}
