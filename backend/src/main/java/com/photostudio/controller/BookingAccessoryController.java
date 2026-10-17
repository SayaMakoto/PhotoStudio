package com.photostudio.controller;

import com.photostudio.dto.bookings.BookingAccessoryRequest;
import com.photostudio.dto.bookings.BookingAccessoryResponse;
import com.photostudio.service.BookingAccessoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/booking-accessories")
@RequiredArgsConstructor
public class BookingAccessoryController {

    private final BookingAccessoryService bookingAccessoryService;

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<BookingAccessoryResponse>> getAccessoriesByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingAccessoryService.getAccessoriesByBookingId(bookingId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingAccessoryResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingAccessoryService.getById(id));
    }

    @PostMapping
    public ResponseEntity<BookingAccessoryResponse> addAccessoryToBooking(
            @RequestBody BookingAccessoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingAccessoryService.addAccessoryToBooking(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingAccessoryResponse> updateBookingAccessory(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body) {
        return ResponseEntity.ok(bookingAccessoryService.updateBookingAccessory(
                id, body != null ? body.get("quantity") : null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeAccessoryFromBooking(@PathVariable Long id) {
        bookingAccessoryService.removeAccessoryFromBooking(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/booking/{bookingId}/total")
    public ResponseEntity<Map<String, Object>> calculateTotalAccessoryPrice(@PathVariable Long bookingId) {
        Double total = bookingAccessoryService.calculateTotalAccessoryPrice(bookingId);
        return ResponseEntity.ok(Map.of("bookingId", bookingId, "totalAccessoryPrice", total));
    }
}
