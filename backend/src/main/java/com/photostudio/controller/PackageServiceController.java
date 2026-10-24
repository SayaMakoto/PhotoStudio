package com.photostudio.controller;

import com.photostudio.dto.packages.PackageServiceRequest;
import com.photostudio.dto.packages.PackageServiceResponse;
import com.photostudio.service.PackageServiceItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/package-services")
@RequiredArgsConstructor
public class PackageServiceController {
    private final PackageServiceItemService service;

    @GetMapping("/package/{packageId}")
    public ResponseEntity<List<PackageServiceResponse>> getByPackage(@PathVariable Long packageId) {
        return ResponseEntity.ok(service.getServicesByPackageId(packageId));
    }
    @GetMapping("/{id}")
    public ResponseEntity<PackageServiceResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }
    @PostMapping
    public ResponseEntity<PackageServiceResponse> add(@RequestBody PackageServiceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addServiceToPackage(request));
    }
    @PutMapping("/{id}")
    public ResponseEntity<PackageServiceResponse> update(@PathVariable Long id, @RequestBody PackageServiceRequest request) {
        return ResponseEntity.ok(service.updatePackageService(id, request));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        service.removeServiceFromPackage(id);
        return ResponseEntity.noContent().build();
    }
}
