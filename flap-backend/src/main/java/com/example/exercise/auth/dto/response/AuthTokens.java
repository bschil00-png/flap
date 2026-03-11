package com.example.exercise.auth.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthTokens {
    private String accessToken;
    private String refreshToken;
}