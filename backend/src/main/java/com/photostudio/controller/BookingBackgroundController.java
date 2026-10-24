package com.photostudio.controller;

import com.photostudio.dto.bookings.BookingBackgroundRequest;
import com.photostudio.dto.bookings.BookingBackgroundResponse;
import com.photostudio.service.BookingBackgroundService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/booking-backgrounds")
@RequiredArgsConstructor
public class BookingBackgroundController {

    private final BookingBackgroundService bookingBackgroundService;

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<BookingBackgroundResponse>> getBackgroundsByBookingId(
            @PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingBackgroundService.getBackgroundsByBookingId(bookingId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingBackgroundResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingBackgroundService.getById(id));
    }

    @PostMapping
    public ResponseEntity<BookingBackgroundResponse> addBackgroundToBooking(
            @RequestBody BookingBackgroundRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingBackgroundService.addBackgroundToBooking(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingBackgroundResponse> updateBookingBackground(
            @PathVariable Long id,
            @RequestBody BookingBackgroundRequest request) {
        return ResponseEntity.ok(bookingBackgroundService.updateBookingBackground(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeBackgroundFromBooking(@PathVariable Long id) {
        bookingBackgroundService.removeBackgroundFromBooking(id);
        return ResponseEntity.noContent().build();
    }
}
