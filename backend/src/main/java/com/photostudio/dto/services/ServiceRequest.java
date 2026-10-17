package com.photostudio.dto.services;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRequest {

    private String name;
    private String type;
    private String description;
    private Integer duration;
    private Double price;
    private String status;

    private static final Set<String> VALID_TYPES = Set.of(
            "photography", "makeup", "clothing", "accessory", "background");
    private static final Set<String> VALID_STATUSES = Set.of("active", "inactive");

    public void validate() {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Tên dịch vụ không được để trống");
        }
        if (name.length() > 255) {
            throw new IllegalArgumentException("Tên dịch vụ tối đa 255 ký tự");
        }

        if (type == null || type.isBlank()) {
            throw new IllegalArgumentException("Loại dịch vụ không được để trống");
        }
        if (!VALID_TYPES.contains(type.trim().toLowerCase())) {
            throw new IllegalArgumentException(
                    "Loại dịch vụ không hợp lệ. Các loại hợp lệ: photography, makeup, clothing, accessory, background");
        }

        if (description != null && description.length() > 255) {
            throw new IllegalArgumentException("Mô tả dịch vụ tối đa 255 ký tự");
        }

        if (duration != null && duration < 0) {
            throw new IllegalArgumentException("Thời lượng dịch vụ không được âm");
        }

        if (price != null && price < 0) {
            throw new IllegalArgumentException("Giá dịch vụ không được âm");
        }

        if (status != null && !status.isBlank() && !VALID_STATUSES.contains(status.trim().toLowerCase())) {
            throw new IllegalArgumentException(
                    "Trạng thái dịch vụ không hợp lệ. Các trạng thái hợp lệ: active, inactive");
        }
    }
}
