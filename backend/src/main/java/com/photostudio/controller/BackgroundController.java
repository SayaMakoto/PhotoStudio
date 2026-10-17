package com.photostudio.controller;

import com.photostudio.dto.backgrounds.BackgroundRequest;
import com.photostudio.dto.backgrounds.BackgroundResponse;
import com.photostudio.service.BackgroundService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/backgrounds")
public class BackgroundController {

    private final BackgroundService service;

    public BackgroundController(BackgroundService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<BackgroundResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BackgroundResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<BackgroundResponse>> findByName(@RequestParam String name) {
        return ResponseEntity.ok(service.findByName(name));
    }

    @GetMapping("/status")
    public ResponseEntity<List<BackgroundResponse>> findByStatus(@RequestParam String status) {
        return ResponseEntity.ok(service.findByStatus(status));
    }

    @PostMapping
    public ResponseEntity<BackgroundResponse> create(@RequestBody BackgroundRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BackgroundResponse> update(
            @PathVariable Long id,
            @RequestBody BackgroundRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
