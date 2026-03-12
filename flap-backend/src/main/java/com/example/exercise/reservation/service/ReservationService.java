package com.example.exercise.reservation.service;

import com.example.exercise.reservation.dto.ReservationCreateRequest;
import com.example.exercise.reservation.dto.ReservationResponse;
import com.example.exercise.reservation.dto.ReservationUpdateRequest;
import com.example.exercise.reservation.entity.Reservation;
import com.example.exercise.reservation.entity.ReservationStatus;
import com.example.exercise.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public ReservationResponse create(Long loginMemberId, ReservationCreateRequest req) {
        validateStartTime(req.getStartTime());

        reservationRepository.findByCourtIdAndStartTimeAndStatus(
                req.getCourtId(),
                req.getStartTime(),
                ReservationStatus.BOOKED
        ).ifPresent(reservation -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 예약된 구장입니다.");
        });

        Reservation reservation = Reservation.builder()
                .courtId(req.getCourtId())
                .memberId(loginMemberId)
                .startTime(req.getStartTime())
                .status(ReservationStatus.BOOKED)
                .build();

        Reservation saved = reservationRepository.save(reservation);
        return ReservationResponse.from(saved);
    }

    public ReservationResponse findOne(Long id, Long loginMemberId) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "예약이 존재하지 않습니다."));

        validateReservationOwner(reservation, loginMemberId);
        return ReservationResponse.from(reservation);
    }

    public List<ReservationResponse> findByMemberId(Long memberId) {
        return reservationRepository.findAllByMemberId(memberId)
                .stream()
                .map(ReservationResponse::from)
                .toList();
    }

    public ReservationResponse update(Long id, Long loginMemberId, ReservationUpdateRequest req) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "예약이 존재하지 않습니다."));

        validateReservationOwner(reservation, loginMemberId);

        if (req.getStartTime() != null) {
            validateStartTime(req.getStartTime());

            reservationRepository.findByCourtIdAndStartTimeAndStatus(
                    reservation.getCourtId(),
                    req.getStartTime(),
                    ReservationStatus.BOOKED
            ).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 예약된 구장입니다.");
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

    public ReservationResponse cancel(Long id, Long loginMemberId) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "예약이 존재하지 않습니다."));

        validateReservationOwner(reservation, loginMemberId);

        reservation.setStatus(ReservationStatus.CANCELED);
        Reservation updated = reservationRepository.save(reservation);

        return ReservationResponse.from(updated);
    }

    public void delete(Long id, Long loginMemberId) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "예약이 존재하지 않습니다."));

        validateReservationOwner(reservation, loginMemberId);
        reservationRepository.delete(reservation);
    }

    private void validateReservationOwner(Reservation reservation, Long loginMemberId) {
        if (!reservation.getMemberId().equals(loginMemberId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인 예약만 접근할 수 있습니다.");
        }
    }

    private void validateStartTime(LocalDateTime startTime) {
        if (startTime == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "예약 시간을 입력해주세요.");
        }

        if (startTime.isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "과거 시간은 예약할 수 없습니다.");
        }

        if (startTime.getMinute() != 0 || startTime.getSecond() != 0 || startTime.getNano() != 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "예약 시간은 정각 단위로만 가능합니다.");
        }

        int hour = startTime.getHour();

        if (hour < 9 || hour >= 22) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "예약 가능 시간은 09:00 ~ 22:00 입니다.");
        }
    }

    public List<Integer> findReservedHours(Long courtId, LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();

        List<Reservation> reservations =
                reservationRepository.findAllByCourtIdAndStartTimeBetweenAndStatus(
                        courtId,
                        start,
                        end,
                        ReservationStatus.BOOKED
                );

        return reservations.stream()
                .map(r -> r.getStartTime().getHour())
                .toList();
    }
}