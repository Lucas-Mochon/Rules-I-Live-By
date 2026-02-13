package com.RulesILiveBy.service;

import com.RulesILiveBy.dao.UserDao;
import com.RulesILiveBy.dto.user.UpdateRequestDto;
import com.RulesILiveBy.dto.user.UserDto;
import com.RulesILiveBy.utils.JwtUtil;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    private final UserDao userDao;
    private final JwtUtil jwtUtil;

    public UserService(UserDao userDao, JwtUtil jwtUtil) {
        this.userDao = userDao;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public Optional<UserDto> getMe(String token) {
        String userId = jwtUtil.getUserIdFromToken(token);
        return userDao.findById(userId)
                .map(user -> {
                    UserDto dto = new UserDto();
                    dto.setId(user.getId());
                    dto.setEmail(user.getEmail());
                    dto.setUsername(user.getUsername());
                    return dto;
                });
    }

    @Transactional
    public Optional<UserDto> getUserById(String id) {
        return userDao.findById(id)
                .map(user -> {
                    UserDto dto = new UserDto();
                    dto.setId(user.getId());
                    dto.setEmail(user.getEmail());
                    dto.setUsername(user.getUsername());
                    return dto;
                });
    }

    @Transactional
    public UserDto update(String id, UpdateRequestDto request) {
        return userDao.update(id, request);
    }
}
