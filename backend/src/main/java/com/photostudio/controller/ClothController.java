package com.photostudio.controller;

import com.photostudio.dto.clothes.ClothRequest;
import com.photostudio.dto.clothes.ClothResponse;
import com.photostudio.service.ClothService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clothes")
public class ClothController {

    private final ClothService service;

    public ClothController(ClothService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ClothResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/trash")
    public ResponseEntity<List<ClothResponse>> findTrash() {
        return ResponseEntity.ok(service.findTrash());
    }

    @PutMapping("/trash/{id}/restore")
    public ResponseEntity<ClothResponse> restore(@PathVariable Long id) {
        return ResponseEntity.ok(service.restore(id));
    }

    @DeleteMapping("/trash/{id}/permanent")
    public ResponseEntity<Void> permanentlyDelete(@PathVariable Long id) {
        service.permanentlyDelete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClothResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ClothResponse>> findByName(@RequestParam String name) {
        return ResponseEntity.ok(service.findByName(name));
    }

    @GetMapping("/type")
    public ResponseEntity<List<ClothResponse>> findByType(@RequestParam String type) {
        return ResponseEntity.ok(service.findByType(type));
    }

    @GetMapping("/status")
    public ResponseEntity<List<ClothResponse>> findByStatus(@RequestParam String status) {
        return ResponseEntity.ok(service.findByStatus(status));
    }

    @PostMapping
    public ResponseEntity<ClothResponse> create(@RequestBody ClothRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClothResponse> update(
            @PathVariable Long id,
            @RequestBody ClothRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
