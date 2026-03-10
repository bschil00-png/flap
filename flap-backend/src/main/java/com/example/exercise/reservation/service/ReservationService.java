package com.example.exercise.reservation.service;

import com.example.exercise.reservation.dto.ReservationCreateRequest;
import com.example.exercise.reservation.dto.ReservationResponse;
import com.example.exercise.reservation.dto.ReservationUpdateRequest;
import com.example.exercise.reservation.entity.Reservation;
import com.example.exercise.reservation.entity.ReservationStatus;
import com.example.exercise.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;

    // 예약 생성
    public ReservationResponse create(ReservationCreateRequest req) {
        reservationRepository.findByCourtIdAndStartTimeAndStatus(
                req.getCourtId(),
                req.getStartTime(),
                ReservationStatus.BOOKED
        ).ifPresent(reservation -> {
            throw new RuntimeException("이미 예약된 시간입니다.");
        });

        Reservation reservation = Reservation.builder()
                .courtId(req.getCourtId())
                .memberId(req.getMemberId())
                .startTime(req.getStartTime())
                .status(ReservationStatus.BOOKED)
                .build();

        Reservation saved = reservationRepository.save(reservation);
        return ReservationResponse.from(saved);
    }

    // 예약 단건 조회
    public ReservationResponse findOne(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("예약이 존재하지 않습니다."));
        return ReservationResponse.from(reservation);
    }

    // 예약 전체 조회
    public List<ReservationResponse> findAll() {
        return reservationRepository.findAll()
                .stream()
                .map(ReservationResponse::from)
                .toList();
    }

    // 회원별 예약 조회
    public List<ReservationResponse> findByMemberId(Long memberId) {
        return reservationRepository.findAllByMemberId(memberId)
                .stream()
                .map(ReservationResponse::from)
                .toList();
    }

    // 예약 수정
    public ReservationResponse update(Long id, ReservationUpdateRequest req) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("예약이 존재하지 않습니다."));

        if (req.getStartTime() != null) {
            reservationRepository.findByCourtIdAndStartTimeAndStatus(
                    reservation.getCourtId(),
                    req.getStartTime(),
                    ReservationStatus.BOOKED
            ).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new RuntimeException("이미 예약된 시간입니다.");
                }
            });

            reservation.setStartTime(req.getStartTime());
        }

        if (req.getStatus() != null) {
            reservation.setStatus(req.getStatus());
        }

        Reservation updated = reservationRepository.save(reservation);
        return ReservationResponse.from(updated);
    }

    // 예약 취소
    public ReservationResponse cancel(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("예약이 존재하지 않습니다."));

        reservation.setStatus(ReservationStatus.CANCELED);
        Reservation updated = reservationRepository.save(reservation);

        return ReservationResponse.from(updated);
    }

    // 예약 삭제
    public void delete(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("예약이 존재하지 않습니다."));
        reservationRepository.delete(reservation);
    }
}