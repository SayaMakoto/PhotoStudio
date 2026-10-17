package com.photostudio.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.photostudio.dto.contents.ContentRequest;
import com.photostudio.dto.contents.ContentResponse;
import com.photostudio.service.ContentService;

@RestController
@RequestMapping("/api/contents")
public class ContentController {

    private final ContentService service;

    public ContentController(ContentService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ContentResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContentResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ContentResponse> create(@RequestBody ContentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContentResponse> update(
            @PathVariable Long id,
            @RequestBody ContentRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ContentResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            @RequestParam(required = false) String status) {
        String targetStatus = status;
        if ((targetStatus == null || targetStatus.isBlank()) && body != null) {
            targetStatus = body.get("status");
        }
        return ResponseEntity.ok(service.updateStatus(id, targetStatus));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ContentResponse> findBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(service.findBySlug(slug));
    }

    @GetMapping("/type")
    public ResponseEntity<List<ContentResponse>> findByType(@RequestParam String type) {
        return ResponseEntity.ok(service.findByType(type));
    }

    @GetMapping("/status")
    public ResponseEntity<List<ContentResponse>> findByStatus(@RequestParam String status) {
        return ResponseEntity.ok(service.findByStatus(status));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ContentResponse>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(service.search(keyword));
    }
}
