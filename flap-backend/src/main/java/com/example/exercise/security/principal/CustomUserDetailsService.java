package com.example.exercise.security.principal;

import com.example.exercise.member.entity.Member;
import com.example.exercise.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService {

    private final MemberRepository memberRepository;

    public CustomUserDetails loadUserByEmail(String email) {
        Member member = memberRepository.findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new UsernameNotFoundException("회원이 존재하지 않습니다."));
        return new CustomUserDetails(member);
    }

    public CustomUserDetails loadUserById(Long id) {
        Member member = memberRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new UsernameNotFoundException("회원이 존재하지 않습니다."));
        return new CustomUserDetails(member);
    }
}