package com.photostudio.dto.images;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImageResponse {

    private Long id;

    private String imageableType;

    private Long imageableId;

    private String imageUrl;

    private String description;

    private Boolean isPrimary;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
