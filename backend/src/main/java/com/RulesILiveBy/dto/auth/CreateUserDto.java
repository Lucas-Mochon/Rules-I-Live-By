package com.RulesILiveBy.dto.auth;

import lombok.Data;

@Data
public class CreateUserDto {
    private String email;
    private String password;
    private String username;
}
