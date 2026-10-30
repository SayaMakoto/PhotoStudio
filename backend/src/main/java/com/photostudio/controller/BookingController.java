package com.photostudio.controller;

import com.photostudio.dto.bookings.BookingRequest;
import com.photostudio.dto.bookings.BookingResponse;
import com.photostudio.service.BookingService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<BookingResponse> create(@RequestBody BookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingResponse> update(
            @PathVariable Long id,
            @RequestBody BookingRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            @RequestParam(required = false) String status) {
        String targetStatus = status;
        if ((targetStatus == null || targetStatus.isBlank()) && body != null) {
            targetStatus = body.get("status");
        }
        return ResponseEntity.ok(service.updateStatus(id, targetStatus));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancel(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        return ResponseEntity.ok(service.updateStatus(id, "cancelled"));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelPut(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        return ResponseEntity.ok(service.updateStatus(id, "cancelled"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingResponse>> findByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(service.findByCustomerId(customerId));
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<BookingResponse>> findByRoomId(@PathVariable Long roomId) {
        return ResponseEntity.ok(service.findByRoomId(roomId));
    }

    @GetMapping("/date")
    public ResponseEntity<List<BookingResponse>> findByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(service.findByDate(date));
    }

    @GetMapping("/status")
    public ResponseEntity<List<BookingResponse>> findByStatus(@RequestParam String status) {
        return ResponseEntity.ok(service.findByStatus(status));
    }
}
