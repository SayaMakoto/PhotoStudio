
package com.photostudio.controller;

import com.photostudio.dto.equipment.EquipmentRequest;
import com.photostudio.dto.equipment.EquipmentResponse;
import com.photostudio.service.EquipmentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/equipments", "/api/products"})
public class EquipmentController {

    private final EquipmentService service;

    public EquipmentController(EquipmentService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<EquipmentResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/trash")
    public ResponseEntity<List<EquipmentResponse>> findTrash() {
        return ResponseEntity.ok(service.findTrash());
    }

    @PutMapping("/trash/{id}/restore")
    public ResponseEntity<EquipmentResponse> restore(@PathVariable Long id) {
        return ResponseEntity.ok(service.restore(id));
    }

    @DeleteMapping("/trash/{id}/permanent")
    public ResponseEntity<Void> permanentlyDelete(@PathVariable Long id) {
        service.permanentlyDelete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipmentResponse> findById(
            @PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<EquipmentResponse> create(
            @RequestBody EquipmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipmentResponse> update(
            @PathVariable Long id,
            @RequestBody EquipmentRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<EquipmentResponse>> findByName(
            @RequestParam String name) {
        return ResponseEntity.ok(service.findByName(name));
    }

    @GetMapping("/type")
    public ResponseEntity<List<EquipmentResponse>> findByType(
            @RequestParam String type) {
        return ResponseEntity.ok(service.findByType(type));
    }
}
