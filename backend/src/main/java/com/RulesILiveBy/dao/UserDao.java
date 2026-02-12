package com.RulesILiveBy.dao;

import com.RulesILiveBy.dto.user.UpdateRequestDto;
import com.RulesILiveBy.dto.user.UserDto;
import com.RulesILiveBy.entity.User;
import com.RulesILiveBy.repository.UserRepository;

import java.util.Optional;

import org.springframework.stereotype.Component;

@Component
public class UserDao {
    private final UserRepository userRepository;

    public UserDao(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return this.userRepository.findByEmail(email);
    }

    public User save(User user) {
        return this.userRepository.save(user);
    }

    public UserDto update(String id, UpdateRequestDto request) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();

        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }

        User updatedUser = userRepository.save(user);

        UserDto userDto = new UserDto();
        userDto.setId(updatedUser.getId());
        userDto.setEmail(updatedUser.getEmail());
        userDto.setUsername(updatedUser.getUsername());

        return userDto;
    }

}
