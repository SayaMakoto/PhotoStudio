package com.photostudio.controller;

import com.photostudio.dto.images.ImageRequest;
import com.photostudio.dto.images.ImageResponse;
import com.photostudio.service.ImageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final ImageService service;

    public ImageController(ImageService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ImageResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImageResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ImageResponse> create(@RequestBody ImageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ImageResponse> update(
            @PathVariable Long id,
            @RequestBody ImageRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @PatchMapping("/{id}/primary")
    public ResponseEntity<ImageResponse> setPrimary(@PathVariable Long id) {
        return ResponseEntity.ok(service.setPrimary(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/imageable")
    public ResponseEntity<List<ImageResponse>> findByImageable(
            @RequestParam String type,
            @RequestParam Long id) {
        return ResponseEntity.ok(service.findByImageable(type, id));
    }

    @GetMapping("/primary")
    public ResponseEntity<ImageResponse> findPrimary(
            @RequestParam String type,
            @RequestParam Long id) {
        return ResponseEntity.ok(service.findPrimary(type, id));
    }
}
