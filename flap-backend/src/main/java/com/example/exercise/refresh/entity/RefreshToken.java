package com.example.exercise.refresh.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_token")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_id", nullable = false, unique = true)
    private Long memberId;

    @Column(name = "token_value", nullable = false, length = 1000)
    private String tokenValue;

    @Column(name = "expiry_at", nullable = false)
    private LocalDateTime expiryAt;

    public void update(String tokenValue, LocalDateTime expiryAt) {
        this.tokenValue = tokenValue;
        this.expiryAt = expiryAt;
    }
}