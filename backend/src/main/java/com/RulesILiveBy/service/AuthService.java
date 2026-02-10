package com.RulesILiveBy.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.RulesILiveBy.dao.UserDao;
import com.RulesILiveBy.dto.auth.CreateUserDto;
import com.RulesILiveBy.dto.auth.LoginDto;
import com.RulesILiveBy.dto.auth.LoginResponse;
import com.RulesILiveBy.entity.User;
import com.RulesILiveBy.utils.JwtUtil;

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
    public LoginResponse register(CreateUserDto createUserDTO) {
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
        savedUser.setRefreshToken(refreshToken);
        userDao.save(savedUser);

        String jwtToken = jwtUtil.generateJwtToken(savedUser);

        return new LoginResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getUsername(),
                jwtToken);
    }

    @Transactional
    public LoginResponse login(LoginDto loginDto) {
        Optional<User> user = userDao.findByEmail(loginDto.getEmail());

        if (user.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        User existingUser = user.get();

        if (!passwordEncoder.matches(loginDto.getPassword(), existingUser.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String refreshToken = jwtUtil.generateRefreshToken(existingUser);
        existingUser.setRefreshToken(refreshToken);
        userDao.save(existingUser);

        String jwtToken = jwtUtil.generateJwtToken(existingUser);

        return new LoginResponse(
                existingUser.getId(),
                existingUser.getEmail(),
                existingUser.getUsername(),
                jwtToken);
    }

    @Transactional
    public String refresh(String refreshToken) {
        if (!jwtUtil.isTokenValid(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String userId = jwtUtil.getUserIdFromToken(refreshToken);
        Optional<User> userOpt = userDao.findById(userId);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();

        if (!user.getRefreshToken().equals(refreshToken)) {
            throw new RuntimeException("Refresh token mismatch");
        }

        String newJwtToken = jwtUtil.generateJwtToken(user);
        String newRefreshToken = jwtUtil.generateRefreshToken(user);
        user.setRefreshToken(newRefreshToken);
        userDao.save(user);

        return newJwtToken;
    }
}
