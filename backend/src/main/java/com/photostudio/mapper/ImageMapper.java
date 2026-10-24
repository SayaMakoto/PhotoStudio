package com.photostudio.mapper;

import com.photostudio.dto.images.ImageRequest;
import com.photostudio.dto.images.ImageResponse;
import com.photostudio.model.images.Image;
import com.photostudio.model.images.ImageableType;

public class ImageMapper {

    public static Image toEntity(ImageRequest request) {
        Image image = new Image();
        image.setImageableType(ImageableType.fromValue(request.getImageableType()));
        image.setImageableId(request.getImageableId());
        image.setImageUrl(request.getImageUrl().trim());
        image.setDescription(request.getDescription());
        image.setIsPrimary(Boolean.TRUE.equals(request.getIsPrimary()));
        return image;
    }

    public static void updateEntity(ImageRequest request, Image image) {
        image.setImageableType(ImageableType.fromValue(request.getImageableType()));
        image.setImageableId(request.getImageableId());
        image.setImageUrl(request.getImageUrl().trim());
        image.setDescription(request.getDescription());

        if (request.getIsPrimary() != null) {
            image.setIsPrimary(request.getIsPrimary());
        }
    }

    public static ImageResponse toResponse(Image image) {
        return new ImageResponse(
                image.getId(),
                image.getImageableType() != null ? image.getImageableType().getValue() : null,
                image.getImageableId(),
                image.getImageUrl(),
                image.getDescription(),
                image.getIsPrimary(),
                image.getCreatedAt(),
                image.getUpdatedAt()
        );
    }
}
