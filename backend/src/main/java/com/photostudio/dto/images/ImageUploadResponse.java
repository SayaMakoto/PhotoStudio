package com.photostudio.dto.images;

public record ImageUploadResponse(
        String imageUrl,
        String originalFilename,
        long size,
        String contentType) {
}
