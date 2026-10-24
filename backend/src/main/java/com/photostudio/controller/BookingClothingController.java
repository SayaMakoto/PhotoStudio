package com.photostudio.controller;

import com.photostudio.dto.bookings.BookingClothingRequest;
import com.photostudio.dto.bookings.BookingClothingResponse;
import com.photostudio.service.BookingClothingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/booking-clothing")
@RequiredArgsConstructor
public class BookingClothingController {

    private final BookingClothingService bookingClothingService;

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<BookingClothingResponse>> getClothesByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingClothingService.getClothesByBookingId(bookingId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingClothingResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingClothingService.getById(id));
    }

    @PostMapping
    public ResponseEntity<BookingClothingResponse> addClothToBooking(@RequestBody BookingClothingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingClothingService.addClothToBooking(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingClothingResponse> updateBookingClothing(
            @PathVariable Long id,
            @RequestBody BookingClothingRequest request) {
        return ResponseEntity.ok(bookingClothingService.updateBookingClothing(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeClothFromBooking(@PathVariable Long id) {
        bookingClothingService.removeClothFromBooking(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/booking/{bookingId}/total")
    public ResponseEntity<Map<String, Object>> calculateTotalClothingPrice(@PathVariable Long bookingId) {
        Double total = bookingClothingService.calculateTotalClothingPrice(bookingId);
        return ResponseEntity.ok(Map.of("bookingId", bookingId, "totalClothingPrice", total));
    }
}
