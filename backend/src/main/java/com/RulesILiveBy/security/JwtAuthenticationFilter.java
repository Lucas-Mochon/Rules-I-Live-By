// src/main/java/com/RulesILiveBy/security/JwtAuthenticationFilter.java
package com.RulesILiveBy.security;

import com.RulesILiveBy.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String token = getTokenFromCookie(request);

            System.out.println("🔍 Request: " + request.getMethod() + " " + request.getRequestURI());
            System.out.println("🔑 Token: " + (token != null ? token.substring(0, 20) + "..." : "NULL"));

            if (token != null && jwtUtil.isTokenValid(token)) {
                String userId = jwtUtil.getUserIdFromToken(token);
                System.out.println("✅ User authenticated: " + userId);

                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        userId,
                        null,
                        null);

                SecurityContextHolder.getContext().setAuthentication(auth);
            } else {
                System.out.println("Token invalid or null");
            }
        } catch (Exception e) {
            System.err.println("JWT validation failed: " + e.getMessage());
            e.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
