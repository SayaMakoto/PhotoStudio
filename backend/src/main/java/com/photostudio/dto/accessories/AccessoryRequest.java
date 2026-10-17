package com.photostudio.dto.accessories;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccessoryRequest {

    private String type;
    private String name;
    private String description;
    private Integer quantity;
    private Double price;
    private String status;

    private static final Set<String> VALID_TYPES = Set.of("fashion", "concept", "vintage", "wedding", "other");
    private static final Set<String> VALID_STATUSES = Set.of("available", "rented", "maintenance", "damaged", "retired");

    public void validate() {
        if (type == null || type.isBlank()) {
            throw new IllegalArgumentException("Loại phụ kiện không được để trống");
        }
        if (!VALID_TYPES.contains(type.trim().toLowerCase())) {
            throw new IllegalArgumentException("Loại phụ kiện không hợp lệ. Các loại hợp lệ: fashion, concept, vintage, wedding, other");
        }

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Tên phụ kiện không được để trống");
        }
        if (name.length() > 255) {
            throw new IllegalArgumentException("Tên phụ kiện tối đa 255 ký tự");
        }

        if (description != null && description.length() > 255) {
            throw new IllegalArgumentException("Mô tả phụ kiện tối đa 255 ký tự");
        }

        if (quantity != null && quantity < 0) {
            throw new IllegalArgumentException("Số lượng kho không được âm");
        }

        if (price != null && price < 0) {
            throw new IllegalArgumentException("Giá thuê phụ kiện không được âm");
        }

        if (status != null && !VALID_STATUSES.contains(status.trim().toLowerCase())) {
            throw new IllegalArgumentException("Trạng thái phụ kiện không hợp lệ. Các trạng thái hợp lệ: available, rented, maintenance, damaged, retired");
        }
    }
}
