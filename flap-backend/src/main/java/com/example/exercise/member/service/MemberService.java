package com.example.exercise.member.service;

import com.example.exercise.global.exception.ApiException;
import java.util.List;
import com.example.exercise.global.exception.ErrorCode;
import com.example.exercise.member.dto.request.MemberCreateRequest;
import com.example.exercise.member.dto.response.MemberResponse;
import com.example.exercise.member.dto.request.MemberUpdateRequest;
import com.example.exercise.member.entity.Member;
import com.example.exercise.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;

    // 회원가입
    public MemberResponse create(MemberCreateRequest req) {

        if (memberRepository.existsByEmail(req.getEmail())) {
            throw new ApiException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        Member member = Member.builder()
                .email(req.getEmail())
                .password(req.getPassword()) // 연습용: 나중에 BCrypt로 암호화
                .name(req.getName())
                .build();

        Member saved = memberRepository.save(member);
        return MemberResponse.from(saved);
    }

    // 회원 단건조회
    @Transactional(readOnly = true)
    public MemberResponse findOne(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ApiException(ErrorCode.MEMBER_NOT_FOUND));

        return MemberResponse.from(member);
    }
    
    @Transactional(readOnly = true)
    public List<MemberResponse> findAll() {
        return memberRepository.findAll()
                .stream()
                .map(MemberResponse::from)
                .toList();
    }
    
    //정보수정
    public MemberResponse update(Long id, MemberUpdateRequest req) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ApiException(ErrorCode.MEMBER_NOT_FOUND));

        member.update(req.getName(), req.getPassword());

        return MemberResponse.from(member);
    }
    
    public void delete(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ApiException(ErrorCode.MEMBER_NOT_FOUND));

        memberRepository.delete(member);
    }
    
    
}