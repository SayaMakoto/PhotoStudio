package com.photostudio.controller;

import com.photostudio.dto.employeereviews.EmployeeReviewRequest;
import com.photostudio.dto.employeereviews.EmployeeReviewResponse;
import com.photostudio.dto.reviews.ReviewReplyRequest;
import com.photostudio.service.EmployeeReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employee-reviews")
public class EmployeeReviewController {

    private final EmployeeReviewService service;

    public EmployeeReviewController(EmployeeReviewService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<EmployeeReviewResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeReviewResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PatchMapping("/{id}/reply")
    public ResponseEntity<EmployeeReviewResponse> reply(
            @PathVariable Long id,
            @RequestBody ReviewReplyRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu phản hồi không được để trống");
        }
        request.validate();
        return ResponseEntity.ok(service.reply(id, request.getReply()));
    }

    @GetMapping("/review/{reviewId}")
    public ResponseEntity<List<EmployeeReviewResponse>> findByReviewId(@PathVariable Long reviewId) {
        return ResponseEntity.ok(service.findByReviewId(reviewId));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<EmployeeReviewResponse>> findByEmployeeId(@PathVariable Long employeeId) {
        return ResponseEntity.ok(service.findByEmployeeId(employeeId));
    }

    @GetMapping("/employee/{employeeId}/summary")
    public ResponseEntity<Map<String, Object>> getEmployeeRatingSummary(@PathVariable Long employeeId) {
        return ResponseEntity.ok(service.getEmployeeRatingSummary(employeeId));
    }

    @PostMapping
    public ResponseEntity<EmployeeReviewResponse> create(@RequestBody EmployeeReviewRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeReviewResponse> update(
            @PathVariable Long id,
            @RequestBody EmployeeReviewRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
