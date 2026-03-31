package com.example.exercise.reservation.controller;

import com.example.exercise.reservation.dto.ReservationCreateRequest;
import com.example.exercise.reservation.dto.ReservationResponse;
import com.example.exercise.reservation.dto.ReservationSlotResponse;
import com.example.exercise.reservation.dto.ReservationUpdateRequest;
import com.example.exercise.reservation.service.ReservationService;
import com.example.exercise.security.principal.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ReservationResponse create(
            @RequestBody ReservationCreateRequest req,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return reservationService.create(userDetails.getId(), req);
    }

    @GetMapping("/{id}")
    public ReservationResponse findOne(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return reservationService.findOne(id, userDetails.getId());
    }

    @GetMapping("/me")
    public List<ReservationResponse> myReservations(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return reservationService.findByMemberId(userDetails.getId());
    }

    @GetMapping("/slots")
    public List<ReservationSlotResponse> slots(
            @RequestParam Long courtId,
            @RequestParam String date
    ) {
        return reservationService.findReservationSlots(
                courtId,
                LocalDate.parse(date)
        );
    }

    @PutMapping("/{id}")
    public ReservationResponse update(
            @PathVariable("id") Long id,
            @RequestBody ReservationUpdateRequest req,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return reservationService.update(id, userDetails.getId(), req);
    }

    @PutMapping("/{id}/cancel")
    public ReservationResponse cancel(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return reservationService.cancel(id, userDetails.getId());
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        reservationService.delete(id, userDetails.getId());
    }
}