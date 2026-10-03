package com.photostudio.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PackageRequest {

    private String name;
    private String description;
    private Integer duration;
    private Double price;
    private String status;
    private List<PackageEquipmentItemRequest> equipments;

    private static final Set<String> VALID_STATUSES = Set.of("active", "inactive");
    private static final Set<String> VALID_EQUIPMENT_TYPES = Set.of(
            "camera", "lens", "lighting", "tripod", "other");

    public void validate() {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Tên gói chụp không được để trống");
        }

        if (name.length() > 255) {
            throw new IllegalArgumentException("Tên gói chụp tối đa 255 ký tự");
        }

        if (description != null && description.length() > 255) {
            throw new IllegalArgumentException("Mô tả gói chụp tối đa 255 ký tự");
        }

        if (duration != null && duration < 0) {
            throw new IllegalArgumentException("Thời lượng gói chụp không được âm");
        }

        if (price != null && price < 0) {
            throw new IllegalArgumentException("Giá gói chụp không được âm");
        }

        if (status != null && !VALID_STATUSES.contains(status.trim().toLowerCase())) {
            throw new IllegalArgumentException("Trạng thái gói chụp không hợp lệ. Hợp lệ: active, inactive");
        }

        if (equipments != null) {
            for (PackageEquipmentItemRequest item : equipments) {
                if (item.getEquipmentType() == null || item.getEquipmentType().isBlank()) {
                    throw new IllegalArgumentException("Loại thiết bị không được để trống");
                }

                String normalizedType = item.getEquipmentType().trim().toLowerCase();
                if (!VALID_EQUIPMENT_TYPES.contains(normalizedType)) {
                    throw new IllegalArgumentException(
                            "Loại thiết bị '" + item.getEquipmentType() + "' không tồn tại. Các loại hợp lệ: camera, lens, lighting, tripod, other");
                }

                if (item.getQuantity() != null && item.getQuantity() <= 0) {
                    throw new IllegalArgumentException("Số lượng thiết bị phải lớn hơn 0");
                }
            }
        }
    }
}
