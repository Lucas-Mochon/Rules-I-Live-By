package com.RulesILiveBy.dto.auth;

import lombok.Data;

@Data
public class RefreshTokenRequest {
    private String jwtToken;

    public RefreshTokenRequest() {
    }

    public RefreshTokenRequest(String jwtToken) {
        this.jwtToken = jwtToken;
    }
}
