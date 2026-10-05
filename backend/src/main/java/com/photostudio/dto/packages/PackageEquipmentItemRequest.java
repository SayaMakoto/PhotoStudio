package com.photostudio.dto.packages;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PackageEquipmentItemRequest {

    private String equipmentType;
    private Integer quantity;

    public void validate() {
        if (equipmentType == null || equipmentType.isBlank()) {
            throw new IllegalArgumentException("Loại thiết bị không được để trống");
        }
        if (quantity != null && quantity <= 0) {
            throw new IllegalArgumentException("Số lượng thiết bị phải lớn hơn 0");
        }
    }
}
