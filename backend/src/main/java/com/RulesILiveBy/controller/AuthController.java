package com.RulesILiveBy.controller;

import org.springframework.http.ResponseEntity;

import com.RulesILiveBy.common.ApiResponse;
import com.RulesILiveBy.dto.auth.CreateUserDto;
import com.RulesILiveBy.dto.auth.LoginDto;
import com.RulesILiveBy.dto.auth.LoginResponse;
import com.RulesILiveBy.service.AuthService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // POST /auth/register
    @PostMapping("/register")
    public ResponseEntity<Object> register(
            @RequestBody CreateUserDto createUserDTO,
            HttpServletResponse response) {
        try {
            LoginResponse loginResponse = authService.register(createUserDTO, response);
            return ResponseEntity.ok(ApiResponse.success(loginResponse));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // POST /auth/login
    @PostMapping("/login")
    public ResponseEntity<Object> login(
            @RequestBody LoginDto loginDto,
            HttpServletResponse response) {
        try {
            LoginResponse loginResponse = authService.login(loginDto, response);
            return ResponseEntity.ok(ApiResponse.success(loginResponse));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // POST /auth/refresh
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<String>> refresh(
            HttpServletRequest request,
            HttpServletResponse response) {

        try {
            String refreshToken = extractRefreshTokenFromCookie(request);

            if (refreshToken == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Missing refresh token"));
            }

            String newAccessToken = authService.refresh(refreshToken, response);

            return ResponseEntity.ok(ApiResponse.success(newAccessToken));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // POST /auth/logout
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(
            HttpServletRequest request,
            HttpServletResponse response) {
        try {
            String refreshToken = extractRefreshTokenFromCookie(request);

            if (refreshToken == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Missing refresh token"));
            }

            authService.logout(refreshToken, response);
            return ResponseEntity.ok(ApiResponse.success("Successfully logged out"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(ApiResponse.error(e.getMessage()));
        }
    }

    private String extractRefreshTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
