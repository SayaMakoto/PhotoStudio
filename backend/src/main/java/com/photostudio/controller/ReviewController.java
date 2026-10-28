package com.photostudio.controller;

import com.photostudio.dto.reviews.EmployeeRatingResponse;
import com.photostudio.dto.reviews.ReviewRequest;
import com.photostudio.dto.reviews.ReviewReplyRequest;
import com.photostudio.dto.reviews.ReviewResponse;
import com.photostudio.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService service;

    public ReviewController(ReviewService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ReviewResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PatchMapping("/{id}/reply")
    public ResponseEntity<ReviewResponse> reply(
            @PathVariable Long id,
            @RequestBody ReviewReplyRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu phản hồi không được để trống");
        }
        request.validate();
        return ResponseEntity.ok(service.reply(id, request.getReply()));
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> create(@RequestBody ReviewRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponse> update(
            @PathVariable Long id,
            @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ReviewResponse> findByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(service.findByBookingId(bookingId));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<ReviewResponse>> findByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(service.findByCustomerId(customerId));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<ReviewResponse>> findByEmployeeId(@PathVariable Long employeeId) {
        return ResponseEntity.ok(service.findByEmployeeId(employeeId));
    }

    @GetMapping("/employee/{employeeId}/rating")
    public ResponseEntity<EmployeeRatingResponse> getEmployeeRating(@PathVariable Long employeeId) {
        return ResponseEntity.ok(service.getEmployeeRating(employeeId));
    }
}
