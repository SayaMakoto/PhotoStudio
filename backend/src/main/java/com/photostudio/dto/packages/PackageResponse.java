package com.photostudio.dto.packages;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PackageResponse {

    private Long id;
    private String name;
    private String description;
    private Integer duration;
    private Double price;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<PackageEquipmentItemResponse> equipments;
    private List<PackageClothItemResponse> clothes;
    private List<PackageAccessoryItemResponse> accessories;
    private LocalDateTime deletedAt;
}
