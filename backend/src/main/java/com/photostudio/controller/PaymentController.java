package com.photostudio.controller;

import com.photostudio.dto.payments.PaymentRequest;
import com.photostudio.dto.payments.PaymentResponse;
import com.photostudio.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<PaymentResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<PaymentResponse>> findByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(service.findByBookingId(bookingId));
    }

    @GetMapping("/booking/{bookingId}/total-paid")
    public ResponseEntity<Map<String, Object>> getTotalPaid(@PathVariable Long bookingId) {
        return ResponseEntity.ok(service.getTotalPaidByBookingId(bookingId));
    }

    @GetMapping("/status")
    public ResponseEntity<List<PaymentResponse>> findByStatus(@RequestParam String status) {
        return ResponseEntity.ok(service.findByStatus(status));
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> create(@RequestBody PaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentResponse> update(
            @PathVariable Long id,
            @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PaymentResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            @RequestParam(required = false) String status) {
        String targetStatus = status;
        if ((targetStatus == null || targetStatus.isBlank()) && body != null) {
            targetStatus = body.get("status");
        }
        return ResponseEntity.ok(service.updateStatus(id, targetStatus));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
