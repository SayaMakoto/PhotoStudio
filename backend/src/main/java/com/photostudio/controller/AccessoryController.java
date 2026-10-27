package com.photostudio.controller;

import com.photostudio.dto.accessories.AccessoryRequest;
import com.photostudio.dto.accessories.AccessoryResponse;
import com.photostudio.mapper.AccessoryMapper;
import com.photostudio.model.accessories.Accessory;
import com.photostudio.model.accessories.AccessoryStatus;
import com.photostudio.model.accessories.AccessoryType;
import com.photostudio.service.AccessoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"/api/accessories", "/api/categories"})
public class AccessoryController {

    private final AccessoryService accessoryService;
    private final AccessoryMapper accessoryMapper;

    public AccessoryController(AccessoryService accessoryService, AccessoryMapper accessoryMapper) {
        super();
        this.accessoryService = accessoryService;
        this.accessoryMapper = accessoryMapper;
    }

    @GetMapping
    public ResponseEntity<List<AccessoryResponse>> getAllAccessories() {
        List<AccessoryResponse> accessories = accessoryService.getAllAccessories().stream()
                .map(accessoryMapper::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(accessories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccessoryResponse> getAccessoryById(@PathVariable Long id) {
        return accessoryService.getAccessoryById(id)
                .map(accessory -> ResponseEntity.ok(accessoryMapper.toResponseDTO(accessory)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<AccessoryResponse>> searchAccessories(@RequestParam String name) {
        List<AccessoryResponse> accessories = accessoryService.searchAccessoriesByName(name).stream()
                .map(accessoryMapper::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(accessories);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<AccessoryResponse>> getAccessoriesByType(@PathVariable AccessoryType type) {
        List<AccessoryResponse> accessories = accessoryService.getAccessoriesByType(type).stream()
                .map(accessoryMapper::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(accessories);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<AccessoryResponse>> getAccessoriesByStatus(@PathVariable AccessoryStatus status) {
        List<AccessoryResponse> accessories = accessoryService.getAccessoriesByStatus(status).stream()
                .map(accessoryMapper::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(accessories);
    }

    @PostMapping
    public ResponseEntity<AccessoryResponse> createAccessory(@RequestBody AccessoryRequest request) {
        Accessory accessory = accessoryMapper.toEntity(request);
        Accessory createdAccessory = accessoryService.createAccessory(accessory);
        return ResponseEntity.status(HttpStatus.CREATED).body(accessoryMapper.toResponseDTO(createdAccessory));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccessoryResponse> updateAccessory(@PathVariable Long id, @RequestBody AccessoryRequest request) {
        Accessory existingAccessory = accessoryService.getAccessoryById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phụ kiện với ID: " + id));

        accessoryMapper.updateEntityFromRequest(request, existingAccessory);
        Accessory updatedAccessory = accessoryService.updateAccessory(id, existingAccessory);
        return ResponseEntity.ok(accessoryMapper.toResponseDTO(updatedAccessory));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccessory(@PathVariable Long id) {
        accessoryService.deleteAccessory(id);
        return ResponseEntity.noContent().build();
    }
}
