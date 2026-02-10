package com.RulesILiveBy.controller;

import com.RulesILiveBy.common.ApiResponse;
import com.RulesILiveBy.entity.User;
import com.RulesILiveBy.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET /users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUser(
            @PathVariable String id,
            Authentication authentication) {

        String currentUserId = (String) authentication.getPrincipal();

        if (!currentUserId.equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied", "You can only access your own profile"));
        }

        return userService.getUserById(id)
                .map(user -> ResponseEntity.ok(
                        ApiResponse.success("User retrieved successfully", user)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found", "No user with ID: " + id)));
    }
}
