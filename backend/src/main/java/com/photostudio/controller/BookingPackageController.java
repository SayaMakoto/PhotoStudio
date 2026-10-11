package com.photostudio.controller;

import com.photostudio.dto.bookings.BookingPackageRequest;
import com.photostudio.dto.bookings.BookingPackageResponse;
import com.photostudio.service.BookingPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/booking-packages")
@RequiredArgsConstructor
public class BookingPackageController {

    private final BookingPackageService bookingPackageService;

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<BookingPackageResponse>> getPackagesByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingPackageService.getPackagesByBookingId(bookingId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingPackageResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingPackageService.getById(id));
    }

    @PostMapping
    public ResponseEntity<BookingPackageResponse> addPackageToBooking(@RequestBody BookingPackageRequest request) {
        BookingPackageResponse response = bookingPackageService.addPackageToBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingPackageResponse> updateBookingPackage(
            @PathVariable Long id,
            @RequestBody BookingPackageRequest request) {
        BookingPackageResponse response = bookingPackageService.updateBookingPackage(
                id, request.getQuantity(), request.getUnitPrice());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removePackageFromBooking(@PathVariable Long id) {
        bookingPackageService.removePackageFromBooking(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/booking/{bookingId}/total")
    public ResponseEntity<Map<String, Object>> calculateTotalPackagePrice(@PathVariable Long bookingId) {
        Double total = bookingPackageService.calculateTotalPackagePrice(bookingId);
        return ResponseEntity.ok(Map.of("bookingId", bookingId, "totalPackagePrice", total));
    }
}
