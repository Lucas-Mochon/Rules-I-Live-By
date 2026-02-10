package com.RulesILiveBy.service;

import com.RulesILiveBy.dao.UserDao;
import com.RulesILiveBy.entity.User;

import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    private final UserDao userDao;

    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }

    public Optional<User> getUserById(String id) {
        return userDao.findById(id);
    }
}
