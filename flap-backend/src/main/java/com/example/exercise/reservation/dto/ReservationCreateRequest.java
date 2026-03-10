package com.example.exercise.reservation.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReservationCreateRequest {

    private Long courtId;
    private Long memberId;
    private LocalDateTime startTime;
}