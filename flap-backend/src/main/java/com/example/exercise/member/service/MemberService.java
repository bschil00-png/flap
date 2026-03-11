package com.example.exercise.member.service;

import com.example.exercise.refresh.repository.RefreshTokenRepository;
import com.example.exercise.member.dto.request.MemberCreateRequest;
import com.example.exercise.member.dto.request.MemberUpdateRequest;
import com.example.exercise.member.dto.response.MemberResponse;
import com.example.exercise.member.entity.Member;
import com.example.exercise.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public MemberResponse create(MemberCreateRequest req) {
        if (memberRepository.existsByEmailAndDeletedFalse(req.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        Member member = Member.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
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

        String encodedPassword = null;
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            encodedPassword = passwordEncoder.encode(req.getPassword());
        }

        member.update(req.getName(), encodedPassword);

        return MemberResponse.from(member);
    }

    @Transactional
    public void delete(Long id) {
        Member member = memberRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        // 회원의 refresh token 먼저 삭제
        refreshTokenRepository.deleteByMemberId(id);

        // 회원 soft delete
        member.softDelete();
    }
}