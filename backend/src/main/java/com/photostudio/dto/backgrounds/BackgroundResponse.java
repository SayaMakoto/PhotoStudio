package com.photostudio.dto.backgrounds;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BackgroundResponse {

    private Long id;
    private String name;
    private String description;
    private String status;
    private LocalDateTime deletedAt;
}
