package com.photostudio.controller;

import com.photostudio.dto.salaries.SalaryResponse;
import com.photostudio.service.SalaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/salaries")
public class SalaryController {

    private final SalaryService salaryService;

    public SalaryController(SalaryService salaryService) {
        this.salaryService = salaryService;
    }

    @GetMapping
    public ResponseEntity<List<SalaryResponse>> findAll(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(salaryService.findAll(month, year));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalaryResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(salaryService.findById(id));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<SalaryResponse>> findByEmployeeId(@PathVariable Long employeeId) {
        return ResponseEntity.ok(salaryService.findByEmployeeId(employeeId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SalaryResponse>> findByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(salaryService.findByUserId(userId));
    }

    @PostMapping("/calculate")
    public ResponseEntity<List<SalaryResponse>> calculate(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(salaryService.calculateMonthlySalaries(month, year));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SalaryResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(salaryService.updateStatus(id, payload));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        salaryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
