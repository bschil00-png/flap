package com.example.exercise.reservation.controller;

import com.example.exercise.reservation.dto.ReservationCreateRequest;
import com.example.exercise.reservation.dto.ReservationResponse;
import com.example.exercise.reservation.dto.ReservationUpdateRequest;
import com.example.exercise.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService reservationService;

 // 예약 생성 (Create)
    @PostMapping
    public ReservationResponse create(@RequestBody ReservationCreateRequest req) {
        return reservationService.create(req);
    }
 // 예약 단건 조회 (Read)
    @GetMapping("/{id}")
    public ReservationResponse findOne(@PathVariable("id") Long id) {
        return reservationService.findOne(id);
    }
 // 전체 예약 조회 (Read)
    @GetMapping
    public List<ReservationResponse> findAll() {
        return reservationService.findAll();
    }
    // 회원별 예약 조회
    @GetMapping("/member/{memberId}")
    public List<ReservationResponse> findByMemberId(@PathVariable("memberId") Long memberId) {
        return reservationService.findByMemberId(memberId);
    }
    // 예약 수정 (Update)
    @PutMapping("/{id}")
    public ReservationResponse update(@PathVariable("id") Long id,
                                      @RequestBody ReservationUpdateRequest req) {
        return reservationService.update(id, req);
    }
 // 예약 취소
    @PutMapping("/{id}/cancel")
    public ReservationResponse cancel(@PathVariable("id") Long id) {
        return reservationService.cancel(id);
    }
    // 예약 삭제
    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {
        reservationService.delete(id);
    }
}