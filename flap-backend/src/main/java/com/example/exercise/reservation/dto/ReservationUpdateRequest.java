package com.example.exercise.reservation.dto;

import com.example.exercise.reservation.entity.ReservationStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReservationUpdateRequest {

    private LocalDateTime startTime;
    private ReservationStatus status;
}