package com.photostudio.dto.services;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceResponse {

    private Long id;
    private String name;
    private String type;
    private String description;
    private Integer duration;
    private Double price;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
