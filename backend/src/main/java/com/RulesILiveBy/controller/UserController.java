package com.RulesILiveBy.controller;

import com.RulesILiveBy.entity.User;
import com.RulesILiveBy.dto.CreateUserDto;
import com.RulesILiveBy.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // POST /users
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody CreateUserDto createUserDTO) {
        User created = userService.createUser(createUserDTO);
        return ResponseEntity.ok(created);
    }

    // GET /users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
