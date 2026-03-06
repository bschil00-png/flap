package com.example.exercise.member.controller;

import com.example.exercise.member.dto.request.MemberCreateRequest;
import com.example.exercise.member.dto.response.MemberResponse;
import com.example.exercise.member.dto.request.MemberUpdateRequest;
import com.example.exercise.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;

    // 회원가입
    @PostMapping
    public MemberResponse create(@RequestBody MemberCreateRequest req) {
        return memberService.create(req);
    }

    // 단건조회
    @GetMapping("/{id}")
    public MemberResponse findOne(@PathVariable("id") Long id) {
        return memberService.findOne(id);
    }
    
    //전체조회
    @GetMapping
    public List<MemberResponse> findAll() {
        return memberService.findAll();
    }
    
    @PutMapping("/{id}")
    public MemberResponse update(
    		@PathVariable("id") Long id,
            @RequestBody MemberUpdateRequest req
    ) {
        return memberService.update(id, req);
    }
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {
        memberService.delete(id);
    }
    
    
}


















