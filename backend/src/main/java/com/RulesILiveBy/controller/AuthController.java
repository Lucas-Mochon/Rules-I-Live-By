package com.RulesILiveBy.controller;

import org.springframework.http.ResponseEntity;

import com.RulesILiveBy.common.ApiResponse;
import com.RulesILiveBy.dto.auth.CreateUserDto;
import com.RulesILiveBy.dto.auth.LoginDto;
import com.RulesILiveBy.dto.auth.LoginResponse;
import com.RulesILiveBy.dto.auth.TokenRequest;
import com.RulesILiveBy.service.AuthService;
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
    public ResponseEntity<Object> register(@RequestBody CreateUserDto createUserDTO) {
        try {
            LoginResponse response = authService.register(createUserDTO);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // POST /auth/login
    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginDto loginDto) {
        try {
            LoginResponse response = authService.login(loginDto);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<String>> refresh(@RequestBody TokenRequest request) {
        String refreshToken = request.getToken();

        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Missing token"));
        }

        try {
            String newJwtToken = authService.refresh(refreshToken);
            return ResponseEntity.ok(ApiResponse.success(newJwtToken));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(@RequestBody TokenRequest request) {
        String refreshToken = request.getToken();

        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Missing token"));
        }

        try {
            authService.logout(refreshToken);
            return ResponseEntity.ok(ApiResponse.success("Successfully logged out"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(ApiResponse.error(e.getMessage()));
        }
    }

}
