package com.example.exercise.member.service;

import com.example.exercise.global.exception.ApiException;
import com.example.exercise.global.exception.ErrorCode;
import com.example.exercise.member.dto.request.MemberCreateRequest;
import com.example.exercise.member.dto.request.MemberUpdateRequest;
import com.example.exercise.member.dto.response.MemberResponse;
import com.example.exercise.member.entity.Member;
import com.example.exercise.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;

    
    @Transactional
    public MemberResponse create(MemberCreateRequest req) {
        Member member = Member.builder()
                .email(req.getEmail())
                .password(req.getPassword())
                .name(req.getName())
                .build();

        Member saved = memberRepository.save(member);
        return MemberResponse.from(saved);
    }

    public MemberResponse findOne(Long id) {
        Member member = memberRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ApiException(ErrorCode.MEMBER_NOT_FOUND));

        return MemberResponse.from(member);
    }

    public List<MemberResponse> findAll() {
        return memberRepository.findAllByDeletedFalse()
                .stream()
                .map(MemberResponse::from)
                .toList();
    }

    @Transactional
    public MemberResponse update(Long id, MemberUpdateRequest req) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));

        // 이름 변경
        if (req.getName() != null && !req.getName().isBlank()) {
            member.setName(req.getName());
        }

        // 비밀번호는 입력했을 때만 변경
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            member.setPassword(req.getPassword());
        }

        return MemberResponse.from(member);
    }

    public void delete(Long id) {
        Member member = memberRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ApiException(ErrorCode.MEMBER_NOT_FOUND));

        member.softDelete();
        memberRepository.save(member);
    }
}