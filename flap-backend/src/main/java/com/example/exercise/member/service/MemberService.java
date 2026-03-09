package com.example.exercise.member.service;

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
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

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
        Member member = memberRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        member.update(req.getName(), req.getPassword());

        return MemberResponse.from(member);
    }

    @Transactional
    public void delete(Long id) {
        Member member = memberRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        member.softDelete();
    }

}