package com.photostudio.dto.accessories;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccessoryResponse {
    private Long id;
    private String type;
    private String name;
    private String description;
    private Integer quantity;
    private Double price;
    private String status;
    private LocalDateTime deletedAt;
}
