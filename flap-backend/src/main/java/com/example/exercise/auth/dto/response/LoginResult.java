package com.example.exercise.auth.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResult {
    private Long id;
    private String email;
    private String name;
    private String accessToken;
    private String refreshToken;
    private String message;
}