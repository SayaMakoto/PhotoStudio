package com.photostudio.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PackageEquipmentItemResponse {
    private Long id;
    private String equipmentType;
    private Integer quantity;
}
