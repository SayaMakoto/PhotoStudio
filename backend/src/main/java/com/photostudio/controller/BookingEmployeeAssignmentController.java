package com.photostudio.controller;

import com.photostudio.dto.bookings.BookingEmployeeAssignmentRequest;
import com.photostudio.dto.bookings.BookingEmployeeAssignmentResponse;
import com.photostudio.dto.bookings.BookingEmployeeAssignmentStatusRequest;
import com.photostudio.service.BookingEmployeeAssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/booking-employee-assignments")
@RequiredArgsConstructor
public class BookingEmployeeAssignmentController {

    private final BookingEmployeeAssignmentService assignmentService;

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<BookingEmployeeAssignmentResponse>> getAssignmentsByBookingId(
            @PathVariable Long bookingId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByBookingId(bookingId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingEmployeeAssignmentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getById(id));
    }

    @PostMapping
    public ResponseEntity<BookingEmployeeAssignmentResponse> assignEmployeeToBooking(
            @RequestBody BookingEmployeeAssignmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(assignmentService.assignEmployeeToBooking(request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BookingEmployeeAssignmentResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody BookingEmployeeAssignmentStatusRequest request) {
        return ResponseEntity.ok(assignmentService.updateStatus(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeAssignment(@PathVariable Long id) {
        assignmentService.removeAssignment(id);
        return ResponseEntity.noContent().build();
    }
}
