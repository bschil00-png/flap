package com.example.exercise.auth.service;

import com.example.exercise.auth.dto.request.LoginRequest;
import com.example.exercise.auth.dto.response.LoginResponse;
import com.example.exercise.member.entity.Member;
import com.example.exercise.member.repository.MemberRepository;
import com.example.exercise.refresh.entity.RefreshToken;
import com.example.exercise.refresh.repository.RefreshTokenRepository;
import com.example.exercise.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final MemberRepository memberRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public LoginResponse login(LoginRequest req) {
        Member member = memberRepository.findByEmailAndDeletedFalse(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(req.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        String accessToken = jwtTokenProvider.createAccessToken(member.getId(), member.getEmail());
        String refreshToken = jwtTokenProvider.createRefreshToken(member.getId());

        LocalDateTime expiryAt = LocalDateTime.now().plusDays(14);

        refreshTokenRepository.findByMemberId(member.getId())
                .ifPresentOrElse(
                        saved -> saved.update(refreshToken, expiryAt),
                        () -> refreshTokenRepository.save(
                                RefreshToken.builder()
                                        .memberId(member.getId())
                                        .tokenValue(refreshToken)
                                        .expiryAt(expiryAt)
                                        .build()
                        )
                );

        return LoginResponse.builder()
                .id(member.getId())
                .email(member.getEmail())
                .name(member.getName())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .message("로그인 성공")
                .build();
    }

    @Transactional
    public LoginResponse refresh(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new IllegalArgumentException("리프레시 토큰이 없습니다.");
        }

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("유효하지 않은 리프레시 토큰입니다.");
        }

        if (!"refresh".equals(jwtTokenProvider.getTokenType(refreshToken))) {
            throw new IllegalArgumentException("리프레시 토큰이 아닙니다.");
        }

        Long memberId = jwtTokenProvider.getMemberId(refreshToken);

        RefreshToken savedToken = refreshTokenRepository.findByMemberId(memberId)
                .orElseThrow(() -> new IllegalArgumentException("저장된 리프레시 토큰이 없습니다."));

        if (!savedToken.getTokenValue().equals(refreshToken)) {
            throw new IllegalArgumentException("리프레시 토큰이 일치하지 않습니다.");
        }

        Member member = memberRepository.findByIdAndDeletedFalse(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        String newAccessToken = jwtTokenProvider.createAccessToken(member.getId(), member.getEmail());

        return LoginResponse.builder()
                .id(member.getId())
                .email(member.getEmail())
                .name(member.getName())
                .accessToken(newAccessToken)
                .message("토큰 재발급 성공")
                .build();
    }

    @Transactional
    public void logout(Long memberId) {
        refreshTokenRepository.deleteByMemberId(memberId);
    }
}