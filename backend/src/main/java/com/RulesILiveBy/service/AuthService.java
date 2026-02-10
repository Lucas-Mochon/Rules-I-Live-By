package com.RulesILiveBy.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.RulesILiveBy.dao.UserDao;
import com.RulesILiveBy.dto.CreateUserDto;
import com.RulesILiveBy.dto.LoginDto;
import com.RulesILiveBy.dto.LoginResponse;
import com.RulesILiveBy.entity.User;
import com.RulesILiveBy.utils.JwtUtil;

@Service
public class AuthService {
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil = new JwtUtil();

    public AuthService(UserDao userDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
    }

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
        savedUser.setJwtToken(jwtUtil.generateJwtToken(savedUser));
        userDao.save(savedUser);

        return new LoginResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getUsername(),
                savedUser.getJwtToken());
    }

    public LoginResponse login(LoginDto loginDto) {
        Optional<User> user = userDao.findByEmail(loginDto.getEmail());
        if (user.isPresent()) {
            User existingUser = user.get();
            if (passwordEncoder.matches(loginDto.getPassword(), existingUser.getPassword())) {
                String token = jwtUtil.generateJwtToken(existingUser);
                existingUser.setJwtToken(token);
                userDao.save(existingUser);

                return new LoginResponse(
                        existingUser.getId(),
                        existingUser.getEmail(),
                        existingUser.getUsername(),
                        existingUser.getJwtToken());
            } else {
                throw new RuntimeException("Invalid email or password");
            }
        } else {
            throw new RuntimeException("Invalid email or password");
        }
    }
}
