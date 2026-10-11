package com.photostudio.controller;

import com.photostudio.dto.bookings.BookingEquipmentRequest;
import com.photostudio.dto.bookings.BookingEquipmentResponse;
import com.photostudio.service.BookingEquipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/booking-equipments")
@RequiredArgsConstructor
public class BookingEquipmentController {

    private final BookingEquipmentService bookingEquipmentService;

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<BookingEquipmentResponse>> getEquipmentsByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingEquipmentService.getEquipmentsByBookingId(bookingId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingEquipmentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingEquipmentService.getById(id));
    }

    @PostMapping
    public ResponseEntity<BookingEquipmentResponse> assignEquipmentToBooking(
            @RequestBody BookingEquipmentRequest request) {
        BookingEquipmentResponse response = bookingEquipmentService.assignEquipmentToBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<BookingEquipmentResponse> returnEquipment(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String note = body != null ? body.get("note") : null;
        BookingEquipmentResponse response = bookingEquipmentService.returnEquipment(id, note);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BookingEquipmentResponse> updateAssignmentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body != null ? body.get("status") : null;
        String note = body != null ? body.get("note") : null;
        BookingEquipmentResponse response = bookingEquipmentService.updateAssignmentStatus(id, status, note);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeEquipmentFromBooking(@PathVariable Long id) {
        bookingEquipmentService.removeEquipmentFromBooking(id);
        return ResponseEntity.noContent().build();
    }
}
