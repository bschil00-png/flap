package com.example.exercise.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class ReservationSlotResponse {
    private int hour;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean available;
    private String reason;
}