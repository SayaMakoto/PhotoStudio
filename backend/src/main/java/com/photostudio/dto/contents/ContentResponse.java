package com.photostudio.dto.contents;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContentResponse {

    private Long id;

    private String type;

    private String title;

    private String slug;

    private String content;

    private String imageUrl;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
