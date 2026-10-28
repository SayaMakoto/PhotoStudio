package com.photostudio.service.impl;

import com.photostudio.service.ImageUploadService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Service
public class ImageUploadServiceImpl implements ImageUploadService {

    private static final Map<String, String> IMAGE_EXTENSIONS = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp",
            "image/gif", ".gif");

    private final Path imageDirectory;

    public ImageUploadServiceImpl(@Value("${app.upload.dir:uploads}") String uploadDirectory) {
        this.imageDirectory = Path.of(uploadDirectory).toAbsolutePath().normalize().resolve("images");
    }

    @Override
    public StoredImage store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Vui lòng chọn tệp hình ảnh");
        }

        String contentType = file.getContentType() == null
                ? ""
                : file.getContentType().toLowerCase(Locale.ROOT).split(";")[0].trim();
        String extension = IMAGE_EXTENSIONS.get(contentType);
        if (extension == null) {
            throw new IllegalArgumentException("Định dạng ảnh không được hỗ trợ. Hãy dùng JPG, PNG, WEBP hoặc GIF");
        }

        try (InputStream input = file.getInputStream()) {
            if (!matchesImageSignature(input.readNBytes(12), contentType)) {
                throw new IllegalArgumentException("Nội dung tệp không khớp với định dạng hình ảnh");
            }
        } catch (IOException exception) {
            throw new IllegalStateException("Không thể đọc tệp hình ảnh", exception);
        }

        String filename = UUID.randomUUID() + extension;
        try {
            Files.createDirectories(imageDirectory);
            Path destination = imageDirectory.resolve(filename).normalize();
            if (!destination.startsWith(imageDirectory)) {
                throw new IllegalArgumentException("Tên tệp không hợp lệ");
            }
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException exception) {
            throw new IllegalStateException("Không thể lưu tệp hình ảnh", exception);
        }

        String originalFilename = file.getOriginalFilename() == null ? "image" : file.getOriginalFilename();
        originalFilename = originalFilename.replace('\\', '/');
        originalFilename = originalFilename.substring(originalFilename.lastIndexOf('/') + 1);
        return new StoredImage(filename, originalFilename, file.getSize(), contentType);
    }

    private boolean matchesImageSignature(byte[] bytes, String contentType) {
        return switch (contentType) {
            case "image/jpeg" -> bytes.length >= 3
                    && (bytes[0] & 0xFF) == 0xFF
                    && (bytes[1] & 0xFF) == 0xD8
                    && (bytes[2] & 0xFF) == 0xFF;
            case "image/png" -> bytes.length >= 8
                    && (bytes[0] & 0xFF) == 0x89
                    && bytes[1] == 0x50 && bytes[2] == 0x4E && bytes[3] == 0x47
                    && bytes[4] == 0x0D && bytes[5] == 0x0A && bytes[6] == 0x1A && bytes[7] == 0x0A;
            case "image/gif" -> bytes.length >= 6
                    && bytes[0] == 'G' && bytes[1] == 'I' && bytes[2] == 'F'
                    && bytes[3] == '8' && (bytes[4] == '7' || bytes[4] == '9') && bytes[5] == 'a';
            case "image/webp" -> bytes.length >= 12
                    && bytes[0] == 'R' && bytes[1] == 'I' && bytes[2] == 'F' && bytes[3] == 'F'
                    && bytes[8] == 'W' && bytes[9] == 'E' && bytes[10] == 'B' && bytes[11] == 'P';
            default -> false;
        };
    }
}
