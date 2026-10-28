package com.photostudio.service;

import org.springframework.web.multipart.MultipartFile;

public interface ImageUploadService {
    StoredImage store(MultipartFile file);

    record StoredImage(String filename, String originalFilename, long size, String contentType) {
    }
}
