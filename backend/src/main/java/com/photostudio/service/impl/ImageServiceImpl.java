package com.photostudio.service.impl;

import com.photostudio.dto.images.ImageRequest;
import com.photostudio.dto.images.ImageResponse;
import com.photostudio.mapper.ImageMapper;
import com.photostudio.model.images.Image;
import com.photostudio.model.images.ImageableType;
import com.photostudio.repository.ImageRepository;
import com.photostudio.service.ImageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ImageServiceImpl implements ImageService {

    private final ImageRepository repository;

    public ImageServiceImpl(ImageRepository repository) {
        this.repository = repository;
    }

    private Image findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hình ảnh có id: " + id));
    }

    // Mỗi đối tượng chỉ có tối đa 1 ảnh đại diện: bỏ cờ primary của các ảnh khác
    private void clearOtherPrimary(ImageableType type, Long imageableId, Long excludeId) {
        List<Image> others = repository.findPrimaryImages(type, imageableId, excludeId);
        for (Image other : others) {
            other.setIsPrimary(false);
        }
        if (!others.isEmpty()) {
            repository.saveAll(others);
        }
    }

    private void checkImageable(String type, Long imageableId) {
        if (type == null || type.isBlank()) {
            throw new IllegalArgumentException("Loại đối tượng gắn ảnh không được để trống");
        }
        if (imageableId == null || imageableId <= 0) {
            throw new IllegalArgumentException("Mã đối tượng gắn ảnh không hợp lệ");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ImageResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(ImageMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ImageResponse findById(Long id) {
        return ImageMapper.toResponse(findEntity(id));
    }

    @Override
    public ImageResponse create(ImageRequest request) {
        request.validate();

        Image image = ImageMapper.toEntity(request);

        if (Boolean.TRUE.equals(image.getIsPrimary())) {
            clearOtherPrimary(image.getImageableType(), image.getImageableId(), null);
        }

        Image saved = repository.save(image);
        return ImageMapper.toResponse(saved);
    }

    @Override
    public ImageResponse update(Long id, ImageRequest request) {
        request.validate();

        Image image = findEntity(id);

        ImageMapper.updateEntity(request, image);

        if (Boolean.TRUE.equals(image.getIsPrimary())) {
            clearOtherPrimary(image.getImageableType(), image.getImageableId(), id);
        }

        Image saved = repository.save(image);
        return ImageMapper.toResponse(saved);
    }

    @Override
    public ImageResponse setPrimary(Long id) {
        Image image = findEntity(id);

        clearOtherPrimary(image.getImageableType(), image.getImageableId(), id);

        image.setIsPrimary(true);
        Image saved = repository.save(image);
        return ImageMapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        Image image = findEntity(id);
        repository.delete(image);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ImageResponse> findByImageable(String type, Long imageableId) {
        checkImageable(type, imageableId);
        return repository.findByImageable(ImageableType.fromValue(type), imageableId)
                .stream()
                .map(ImageMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ImageResponse findPrimary(String type, Long imageableId) {
        checkImageable(type, imageableId);
        ImageableType imageableType = ImageableType.fromValue(type);

        return repository.findPrimaryImages(imageableType, imageableId, null)
                .stream()
                .findFirst()
                .map(ImageMapper::toResponse)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy ảnh đại diện của " + type + " có id: " + imageableId));
    }
}
