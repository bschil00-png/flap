package com.example.exercise.member.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "member") 
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // SERIAL 대응
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 50)
    private String name;

    // DB DEFAULT CURRENT_TIMESTAMP 사용 (DB가 넣어주는 값)
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
    
    
    public void update(String name, String password) {
        this.name = name;
        this.password = password;
    }
    
}