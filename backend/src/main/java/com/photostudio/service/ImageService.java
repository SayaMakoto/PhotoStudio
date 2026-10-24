package com.photostudio.service;

import com.photostudio.dto.images.ImageRequest;
import com.photostudio.dto.images.ImageResponse;

import java.util.List;

public interface ImageService {

    List<ImageResponse> findAll();

    ImageResponse findById(Long id);

    ImageResponse create(ImageRequest request);

    ImageResponse update(Long id, ImageRequest request);

    ImageResponse setPrimary(Long id);

    void delete(Long id);

    List<ImageResponse> findByImageable(String type, Long imageableId);

    ImageResponse findPrimary(String type, Long imageableId);
}
