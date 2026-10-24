package com.photostudio.controller;

import com.photostudio.dto.bookings.BookingServiceRequest;
import com.photostudio.dto.bookings.BookingServiceResponse;
import com.photostudio.service.BookingServiceItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/booking-services")
@RequiredArgsConstructor
public class BookingServiceController {
    private final BookingServiceItemService service;

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<BookingServiceResponse>> getByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(service.getServicesByBookingId(bookingId));
    }
    @GetMapping("/{id}")
    public ResponseEntity<BookingServiceResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }
    @PostMapping
    public ResponseEntity<BookingServiceResponse> add(@RequestBody BookingServiceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addServiceToBooking(request));
    }
    @PutMapping("/{id}")
    public ResponseEntity<BookingServiceResponse> update(@PathVariable Long id, @RequestBody BookingServiceRequest request) {
        return ResponseEntity.ok(service.updateBookingService(id, request));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        service.removeServiceFromBooking(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/booking/{bookingId}/total")
    public ResponseEntity<Map<String, Object>> total(@PathVariable Long bookingId) {
        return ResponseEntity.ok(Map.of("bookingId", bookingId, "totalServicePrice", service.calculateTotalServicePrice(bookingId)));
    }
}
