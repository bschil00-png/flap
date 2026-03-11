package com.example.exercise.auth.controller;

import com.example.exercise.auth.dto.request.LoginRequest;
import com.example.exercise.auth.dto.response.LoginResponse;
import com.example.exercise.auth.service.AuthService;
import com.example.exercise.security.jwt.JwtTokenProvider;
import com.example.exercise.security.principal.CustomUserDetails;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest req, HttpServletResponse response) {
        LoginResponse result = authService.login(req);

        Cookie cookie = new Cookie("refreshToken", result.getRefreshToken());
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 14);
        response.addCookie(cookie);

        return LoginResponse.builder()
                .id(result.getId())
                .email(result.getEmail())
                .name(result.getName())
                .accessToken(result.getAccessToken())
                .message(result.getMessage())
                .build();
    }

    @PostMapping("/refresh")
    public LoginResponse refresh(HttpServletRequest request) {
        String refreshToken = extractRefreshTokenFromCookie(request);
        return authService.refresh(refreshToken);
    }

    @PostMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractRefreshTokenFromCookie(request);
        Long memberId = jwtTokenProvider.getMemberId(refreshToken);

        authService.logout(memberId);

        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    @GetMapping("/me")
    public LoginResponse me(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        return LoginResponse.builder()
                .id(userDetails.getId())
                .email(userDetails.getEmail())
                .name(null)
                .message("현재 로그인 사용자")
                .build();
    }

    private String extractRefreshTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) {
            throw new IllegalArgumentException("리프레시 토큰이 없습니다.");
        }

        for (Cookie cookie : request.getCookies()) {
            if ("refreshToken".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        throw new IllegalArgumentException("리프레시 토큰이 없습니다.");
    }
}