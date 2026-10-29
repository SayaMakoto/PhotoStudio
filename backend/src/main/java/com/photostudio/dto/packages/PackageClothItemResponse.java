package com.photostudio.dto.packages;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PackageClothItemResponse {
    private Long id;
    private Long clothId;
    private String clothName;
    private String type;
    private String size;
    private String color;
    private Integer quantity;
}
