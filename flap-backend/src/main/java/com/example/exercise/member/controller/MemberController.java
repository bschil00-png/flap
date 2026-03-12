package com.example.exercise.member.controller;

import com.example.exercise.member.dto.request.MemberCreateRequest;
import com.example.exercise.member.dto.request.MemberUpdateRequest;
import com.example.exercise.member.dto.response.MemberResponse;
import com.example.exercise.member.service.MemberService;
import com.example.exercise.security.principal.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;

    @PostMapping
    public MemberResponse create(@RequestBody MemberCreateRequest req) {
        return memberService.create(req);
    }

    @GetMapping("/{id}")
    public MemberResponse findOne(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return memberService.findOne(id, userDetails.getId());
    }

    @GetMapping("/me")
    public MemberResponse me(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return memberService.findOne(userDetails.getId(), userDetails.getId());
    }

    @PutMapping("/{id}")
    public MemberResponse update(
            @PathVariable("id") Long id,
            @RequestBody MemberUpdateRequest req,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return memberService.update(id, userDetails.getId(), req);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        memberService.delete(id, userDetails.getId());
    }
}