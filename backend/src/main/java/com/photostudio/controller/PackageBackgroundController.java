package com.photostudio.controller;

import com.photostudio.dto.packages.PackageBackgroundRequest;
import com.photostudio.dto.packages.PackageBackgroundResponse;
import com.photostudio.service.PackageBackgroundService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/package-backgrounds")
@RequiredArgsConstructor
public class PackageBackgroundController {

    private final PackageBackgroundService service;

    @GetMapping("/package/{packageId}")
    public ResponseEntity<List<PackageBackgroundResponse>> getByPackageId(@PathVariable Long packageId) {
        return ResponseEntity.ok(service.getBackgroundsByPackageId(packageId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PackageBackgroundResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<PackageBackgroundResponse> add(@RequestBody PackageBackgroundRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addBackgroundToPackage(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PackageBackgroundResponse> update(
            @PathVariable Long id, @RequestBody PackageBackgroundRequest request) {
        return ResponseEntity.ok(service.updatePackageBackground(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        service.removeBackgroundFromPackage(id);
        return ResponseEntity.noContent().build();
    }
}
