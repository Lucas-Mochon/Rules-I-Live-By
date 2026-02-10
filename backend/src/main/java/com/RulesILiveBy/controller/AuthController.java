package com.RulesILiveBy.controller;

import org.springframework.http.ResponseEntity;

import com.RulesILiveBy.dto.CreateUserDto;
import com.RulesILiveBy.dto.LoginDto;
import com.RulesILiveBy.dto.LoginResponse;
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
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // POST /auth/login
    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginDto loginDto) {
        try {
            LoginResponse response = authService.login(loginDto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
