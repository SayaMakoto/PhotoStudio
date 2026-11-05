package com.photostudio.dto.rooms;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomRequest {

    private String name;
    private String description;
    private Integer capacity;
    private String status;

    private static final Set<String> VALID_STATUSES = Set.of("active", "inactive", "maintenance");

    public void validate() {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Tên phòng chụp không được để trống");
        }

        if (name.length() > 255) {
            throw new IllegalArgumentException("Tên phòng chụp tối đa 255 ký tự");
        }

        if (description != null && description.length() > 255) {
            throw new IllegalArgumentException("Mô tả phòng tối đa 255 ký tự");
        }

        if (capacity != null && capacity < 1) {
            throw new IllegalArgumentException("Sức chứa tối thiểu phải là 1");
        }

        if (capacity != null && capacity > 20) {
            throw new IllegalArgumentException("Sức chứa tối đa là 20");
        }

        if (status != null && !VALID_STATUSES.contains(status.trim().toLowerCase())) {
            throw new IllegalArgumentException("Trạng thái phòng không hợp lệ. Các trạng thái hợp lệ: active, inactive, maintenance");
        }
    }
}
