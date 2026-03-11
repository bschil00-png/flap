package com.example.exercise.refresh.repository;

import com.example.exercise.refresh.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByMemberId(Long memberId);
    Optional<RefreshToken> findByTokenValue(String tokenValue);
    void deleteByMemberId(Long memberId);
}