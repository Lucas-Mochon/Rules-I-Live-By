package com.RulesILiveBy.dto.auth;

import lombok.Data;

@Data
public class TokenRequest {
    private String token;

    public TokenRequest() {
    }

    public TokenRequest(String token) {
        this.token = token;
    }
}
