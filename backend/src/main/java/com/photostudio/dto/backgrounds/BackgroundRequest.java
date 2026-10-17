package com.photostudio.dto.backgrounds;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BackgroundRequest {

    private String name;
    private String description;
    private String status;

    private static final Set<String> VALID_STATUSES = Set.of("active", "inactive", "maintenance");

    public void validate() {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Tên bối cảnh không được để trống");
        }
        if (name.length() > 255) {
            throw new IllegalArgumentException("Tên bối cảnh tối đa 255 ký tự");
        }

        if (description != null && description.length() > 255) {
            throw new IllegalArgumentException("Mô tả bối cảnh tối đa 255 ký tự");
        }

        if (status != null && !VALID_STATUSES.contains(status.trim().toLowerCase())) {
            throw new IllegalArgumentException(
                    "Trạng thái bối cảnh không hợp lệ. Các trạng thái hợp lệ: active, inactive, maintenance");
        }
    }
}
