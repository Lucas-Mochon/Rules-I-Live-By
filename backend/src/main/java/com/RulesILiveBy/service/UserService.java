package com.RulesILiveBy.service;

import com.RulesILiveBy.dao.UserDao;
import com.RulesILiveBy.dto.CreateUserDto;
import com.RulesILiveBy.entity.User;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    private final UserDao userDao;

    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }

    public User createUser(CreateUserDto createUserDTO) {
        User user = new User();
        user.setEmail(createUserDTO.getEmail());
        user.setUsername(createUserDTO.getUsername());
        user.setPassword(createUserDTO.getPassword());
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userDao.save(user);
    }

    public Optional<User> getUserById(String id) {
        return userDao.findById(id);
    }
}
