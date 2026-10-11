package com.photostudio.mapper;

import com.photostudio.dto.contents.ContentRequest;
import com.photostudio.dto.contents.ContentResponse;
import com.photostudio.model.contents.Content;
import com.photostudio.model.contents.ContentStatus;
import com.photostudio.model.contents.ContentType;

public class ContentMapper {

    public static Content toEntity(ContentRequest request) {
        Content content = new Content();
        content.setType(ContentType.valueOf(request.getType().trim().toLowerCase()));
        content.setTitle(request.getTitle().trim());
        content.setSlug(request.getSlug().trim().toLowerCase());
        content.setContent(request.getContent());
        content.setImageUrl(request.getImageUrl());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            content.setStatus(ContentStatus.valueOf(request.getStatus().trim().toLowerCase()));
        } else {
            content.setStatus(ContentStatus.draft);
        }
        return content;
    }

    public static void updateEntity(ContentRequest request, Content content) {
        content.setType(ContentType.valueOf(request.getType().trim().toLowerCase()));
        content.setTitle(request.getTitle().trim());
        content.setSlug(request.getSlug().trim().toLowerCase());
        content.setContent(request.getContent());
        content.setImageUrl(request.getImageUrl());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            content.setStatus(ContentStatus.valueOf(request.getStatus().trim().toLowerCase()));
        }
    }

    public static ContentResponse toResponse(Content content) {
        return new ContentResponse(
                content.getId(),
                content.getType() != null ? content.getType().name() : null,
                content.getTitle(),
                content.getSlug(),
                content.getContent(),
                content.getImageUrl(),
                content.getStatus() != null ? content.getStatus().name() : null,
                content.getCreatedAt(),
                content.getUpdatedAt()
        );
    }
}
