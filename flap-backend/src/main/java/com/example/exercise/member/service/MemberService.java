package com.example.exercise.member.service;

import com.example.exercise.auth.service.AuthService;
import com.example.exercise.member.dto.request.MemberCreateRequest;
import com.example.exercise.member.dto.request.MemberUpdateRequest;
import com.example.exercise.member.dto.response.MemberResponse;
import com.example.exercise.member.entity.Member;
import com.example.exercise.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final AuthService authService;
    private final MemberRepository memberRepository;
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

    public MemberResponse findOne(Long id, Long loginMemberId) {
        validateOwner(id, loginMemberId);

        Member member = memberRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        return MemberResponse.from(member);
    }

    @Transactional
    public MemberResponse update(Long id, Long loginMemberId, MemberUpdateRequest req) {
        validateOwner(id, loginMemberId);

        Member member = memberRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        String newName = member.getName();
        if (req.getName() != null && !req.getName().isBlank()) {
            newName = req.getName();
        }

        String encodedPassword = member.getPassword();
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            encodedPassword = passwordEncoder.encode(req.getPassword());
        }

        member.update(newName, encodedPassword);

        return MemberResponse.from(member);
    }

    @Transactional
    public void delete(Long id, Long loginMemberId) {
        validateOwner(id, loginMemberId);

        Member member = memberRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        // Redis에 저장된 refresh token 삭제
        authService.removeRefreshToken(id);

        // 회원 soft delete
        member.softDelete();
    }

    private void validateOwner(Long targetMemberId, Long loginMemberId) {
        if (!targetMemberId.equals(loginMemberId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인 정보만 접근할 수 있습니다.");
        }
    }
}