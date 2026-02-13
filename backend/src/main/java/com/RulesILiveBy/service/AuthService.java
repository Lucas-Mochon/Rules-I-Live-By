package com.RulesILiveBy.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.RulesILiveBy.dao.UserDao;
import com.RulesILiveBy.dto.auth.CreateUserDto;
import com.RulesILiveBy.dto.auth.LoginDto;
import com.RulesILiveBy.dto.auth.LoginResponse;
import com.RulesILiveBy.entity.User;
import com.RulesILiveBy.utils.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;

@Service
public class AuthService {
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserDao userDao, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public LoginResponse register(CreateUserDto createUserDTO, HttpServletResponse response) {
        Optional<User> existingUser = userDao.findByEmail(createUserDTO.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setEmail(createUserDTO.getEmail());
        user.setUsername(createUserDTO.getUsername());
        user.setPassword(passwordEncoder.encode(createUserDTO.getPassword()));
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userDao.save(user);

        String refreshToken = jwtUtil.generateRefreshToken(savedUser);
        String accessToken = jwtUtil.generateJwtToken(savedUser);

        savedUser.setRefreshToken(refreshToken);
        userDao.save(savedUser);

        setRefreshTokenCookie(response, refreshToken);
        setAccessTokenCookie(response, accessToken);

        return new LoginResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getUsername(),
                accessToken);
    }

    @Transactional
    public LoginResponse login(LoginDto loginDto, HttpServletResponse response) {
        Optional<User> user = userDao.findByEmail(loginDto.getEmail());

        if (user.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        User existingUser = user.get();

        if (!passwordEncoder.matches(loginDto.getPassword(), existingUser.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String refreshToken = jwtUtil.generateRefreshToken(existingUser);
        String accessToken = jwtUtil.generateJwtToken(existingUser);

        existingUser.setRefreshToken(refreshToken);
        userDao.save(existingUser);

        setRefreshTokenCookie(response, refreshToken);
        setAccessTokenCookie(response, accessToken);

        return new LoginResponse(
                existingUser.getId(),
                existingUser.getEmail(),
                existingUser.getUsername(),
                accessToken);
    }

    @Transactional
    public String refresh(String refreshToken, HttpServletResponse response) {
        String userId = jwtUtil.validateTokenAndGetUserId(refreshToken);

        Optional<User> userOpt = userDao.findById(userId);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();
        String storedRefreshToken = user.getRefreshToken();

        if (storedRefreshToken == null || !storedRefreshToken.equals(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        if (!jwtUtil.isTokenValid(refreshToken)) {
            throw new RuntimeException("Refresh token expired");
        }

        String newAccessToken = jwtUtil.generateJwtToken(user);
        String newRefreshToken = jwtUtil.generateRefreshToken(user);

        user.setRefreshToken(newRefreshToken);
        userDao.save(user);

        setRefreshTokenCookie(response, newRefreshToken);
        setAccessTokenCookie(response, newAccessToken);

        return newAccessToken;
    }

    @Transactional
    public void logout(String refreshToken, HttpServletResponse response) {
        String userId = jwtUtil.validateTokenAndGetUserId(refreshToken);

        Optional<User> userOpt = userDao.findById(userId);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();

        user.setRefreshToken(null);
        userDao.save(user);

        clearCookies(response);
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie
                .from("refreshToken", token)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }

    private void setAccessTokenCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie
                .from("accessToken", token)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(30 * 60)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }

    private void clearCookies(HttpServletResponse response) {
        ResponseCookie refreshCookie = ResponseCookie
                .from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(0)
                .build();

        ResponseCookie accessCookie = ResponseCookie
                .from("accessToken", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader("Set-Cookie", refreshCookie.toString());
        response.addHeader("Set-Cookie", accessCookie.toString());
    }
}
