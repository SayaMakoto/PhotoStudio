package com.photostudio.mapper;

import com.photostudio.dto.backgrounds.BackgroundRequest;
import com.photostudio.dto.backgrounds.BackgroundResponse;
import com.photostudio.model.backgrounds.Background;
import com.photostudio.model.backgrounds.BackgroundStatus;

public class BackgroundMapper {

    public static Background toEntity(BackgroundRequest request) {
        Background background = new Background();
        background.setName(request.getName().trim());
        background.setDescription(request.getDescription());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            background.setStatus(BackgroundStatus.valueOf(request.getStatus().trim().toLowerCase()));
        } else {
            background.setStatus(BackgroundStatus.active);
        }

        return background;
    }

    public static void updateEntity(BackgroundRequest request, Background background) {
        background.setName(request.getName().trim());
        background.setDescription(request.getDescription());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            background.setStatus(BackgroundStatus.valueOf(request.getStatus().trim().toLowerCase()));
        }
    }

    public static BackgroundResponse toResponse(Background background) {
        return new BackgroundResponse(
                background.getId(),
                background.getName(),
                background.getDescription(),
                background.getStatus() != null ? background.getStatus().name() : null,
                background.getDeletedAt()
        );
    }
}
