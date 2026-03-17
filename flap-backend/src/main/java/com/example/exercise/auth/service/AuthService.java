package com.example.exercise.auth.service;

import com.example.exercise.auth.dto.request.LoginRequest;
import com.example.exercise.auth.dto.response.LoginResponse;
import com.example.exercise.member.entity.Member;
import com.example.exercise.member.repository.MemberRepository;
import com.example.exercise.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private static final String REFRESH_TOKEN_PREFIX = "RT:";
    private static final long REFRESH_TOKEN_EXPIRE_DAYS = 14;

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, String> redisTemplate;

    @Transactional
    public LoginResponse login(LoginRequest req) {
        Member member = memberRepository.findByEmailAndDeletedFalse(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(req.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        String accessToken = jwtTokenProvider.createAccessToken(member.getId(), member.getEmail());
        String refreshToken = jwtTokenProvider.createRefreshToken(member.getId());

        String redisKey = getRefreshTokenKey(member.getId());

        redisTemplate.opsForValue().set(
                redisKey,
                refreshToken,
                Duration.ofDays(REFRESH_TOKEN_EXPIRE_DAYS)
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

        String redisKey = getRefreshTokenKey(memberId);
        String savedRefreshToken = redisTemplate.opsForValue().get(redisKey);

        if (savedRefreshToken == null) {
            throw new IllegalArgumentException("저장된 리프레시 토큰이 없습니다.");
        }

        if (!savedRefreshToken.equals(refreshToken)) {
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
        String redisKey = getRefreshTokenKey(memberId);
        redisTemplate.delete(redisKey);
    }

    private String getRefreshTokenKey(Long memberId) {
        return REFRESH_TOKEN_PREFIX + memberId;
    }

    @Transactional
    public void removeRefreshToken(Long memberId) {
        redisTemplate.delete(getRefreshTokenKey(memberId));
    }
}