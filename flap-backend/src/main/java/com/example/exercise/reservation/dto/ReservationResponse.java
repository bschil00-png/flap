package com.example.exercise.reservation.dto;

import com.example.exercise.reservation.entity.Reservation;
import com.example.exercise.reservation.entity.ReservationStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReservationResponse {

    private Long id;
    private Long courtId;
    private Long memberId;
    private LocalDateTime startTime;
    private ReservationStatus status;
    private LocalDateTime createdAt;

    public static ReservationResponse from(Reservation reservation) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .courtId(reservation.getCourtId())
                .memberId(reservation.getMemberId())
                .startTime(reservation.getStartTime())
                .status(reservation.getStatus())
                .createdAt(reservation.getCreatedAt())
                .build();
    }
}