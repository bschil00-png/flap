package com.example.exercise.member.dto.request;

import lombok.Getter;

@Getter
public class MemberCreateRequest {
    private String email;
    private String password;
    private String name;
}