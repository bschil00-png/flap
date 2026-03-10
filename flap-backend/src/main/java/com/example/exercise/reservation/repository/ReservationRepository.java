package com.example.exercise.reservation.repository;

import com.example.exercise.reservation.entity.Reservation;
import com.example.exercise.reservation.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findAllByMemberId(Long memberId);

    Optional<Reservation> findByCourtIdAndStartTimeAndStatus(
            Long courtId,
            LocalDateTime startTime,
            ReservationStatus status
    );
}