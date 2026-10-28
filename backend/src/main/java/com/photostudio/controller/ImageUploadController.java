package com.photostudio.controller;

import com.photostudio.dto.images.ImageUploadResponse;
import com.photostudio.service.ImageUploadService;
import com.photostudio.service.ImageUploadService.StoredImage;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/uploads")
public class ImageUploadController {

    private final ImageUploadService imageUploadService;

    public ImageUploadController(ImageUploadService imageUploadService) {
        this.imageUploadService = imageUploadService;
    }

    @PostMapping(value = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageUploadResponse> uploadImage(@RequestParam("file") MultipartFile file) {
        StoredImage storedImage = imageUploadService.store(file);
        String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/images/")
                .path(storedImage.filename())
                .toUriString();

        return ResponseEntity.ok(new ImageUploadResponse(
                imageUrl,
                storedImage.originalFilename(),
                storedImage.size(),
                storedImage.contentType()));
    }
}
