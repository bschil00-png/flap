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
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest req, HttpServletResponse response) {
        LoginResponse result = authService.login(req);

        addAccessTokenCookie(response, result.getAccessToken());
        addRefreshTokenCookie(response, result.getRefreshToken());

        return LoginResponse.builder()
                .id(result.getId())
                .email(result.getEmail())
                .name(result.getName())
                .message(result.getMessage())
                .build();
    }

    @PostMapping("/refresh")
    public LoginResponse refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractRefreshTokenFromCookie(request);
        LoginResponse result = authService.refresh(refreshToken);

        addAccessTokenCookie(response, result.getAccessToken());

        return LoginResponse.builder()
                .id(result.getId())
                .email(result.getEmail())
                .name(result.getName())
                .message("액세스 토큰 재발급 완료")
                .build();
    }

    @PostMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            String refreshToken = extractRefreshTokenFromCookie(request);

            if (jwtTokenProvider.validateToken(refreshToken)
                    && "refresh".equals(jwtTokenProvider.getTokenType(refreshToken))) {
                Long memberId = jwtTokenProvider.getMemberId(refreshToken);
                authService.logout(memberId);
            }
        } catch (Exception ignored) {
            // 토큰이 이상하거나 만료되어도 쿠키 삭제는 진행
        }

        deleteCookie(response, "accessToken");
        deleteCookie(response, "refreshToken");
    }

    @GetMapping("/me")
    public LoginResponse me(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        return LoginResponse.builder()
                .id(userDetails.getId())
                .email(userDetails.getEmail())
                .name(userDetails.getName())
                .message("현재 로그인 사용자")
                .build();
    }

    private String extractRefreshTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "리프레시 토큰이 없습니다.");
        }

        for (Cookie cookie : request.getCookies()) {
            if ("refreshToken".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "리프레시 토큰이 없습니다.");
    }

    private void addAccessTokenCookie(HttpServletResponse response, String accessToken) {
        Cookie cookie = new Cookie("accessToken", accessToken);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 30); // 30분
        // 배포 전까지 로컬이면 secure 생략 또는 false
        response.addCookie(cookie);
    }

    private void addRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 14); // 14일
        response.addCookie(cookie);
    }

    private void deleteCookie(HttpServletResponse response, String name) {
        Cookie cookie = new Cookie(name, null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}