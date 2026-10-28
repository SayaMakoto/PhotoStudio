package com.photostudio.controller;

import com.photostudio.dto.services.ServiceRequest;
import com.photostudio.dto.services.ServiceResponse;
import com.photostudio.service.ServiceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceService service;

    public ServiceController(ServiceService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ServiceResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/trash")
    public ResponseEntity<List<ServiceResponse>> findTrash() {
        return ResponseEntity.ok(service.findTrash());
    }

    @PutMapping("/trash/{id}/restore")
    public ResponseEntity<ServiceResponse> restore(@PathVariable Long id) {
        return ResponseEntity.ok(service.restore(id));
    }

    @DeleteMapping("/trash/{id}/permanent")
    public ResponseEntity<Void> permanentlyDelete(@PathVariable Long id) {
        service.permanentlyDelete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ServiceResponse>> findByName(@RequestParam String name) {
        return ResponseEntity.ok(service.findByName(name));
    }

    @GetMapping("/type")
    public ResponseEntity<List<ServiceResponse>> findByType(@RequestParam String type) {
        return ResponseEntity.ok(service.findByType(type));
    }

    @GetMapping("/status")
    public ResponseEntity<List<ServiceResponse>> findByStatus(@RequestParam String status) {
        return ResponseEntity.ok(service.findByStatus(status));
    }

    @PostMapping
    public ResponseEntity<ServiceResponse> create(@RequestBody ServiceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceResponse> update(
            @PathVariable Long id,
            @RequestBody ServiceRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
