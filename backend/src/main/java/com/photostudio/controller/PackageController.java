package com.photostudio.controller;

import com.photostudio.dto.packages.PackageRequest;
import com.photostudio.dto.packages.PackageResponse;
import com.photostudio.service.PackageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packages")
public class PackageController {

    private final PackageService service;

    public PackageController(PackageService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<PackageResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PackageResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<PackageResponse> create(@RequestBody PackageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PackageResponse> update(
            @PathVariable Long id,
            @RequestBody PackageRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<PackageResponse>> findByName(@RequestParam String name) {
        return ResponseEntity.ok(service.findByName(name));
    }

    @GetMapping("/status")
    public ResponseEntity<List<PackageResponse>> findByStatus(@RequestParam String status) {
        return ResponseEntity.ok(service.findByStatus(status));
    }
}
