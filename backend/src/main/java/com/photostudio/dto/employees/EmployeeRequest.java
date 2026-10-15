package com.photostudio.dto.employees;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRequest {

    private Long userId;
    private String position;
    private LocalDate hireDate;
    private String status;

    private static final Set<String> VALID_POSITIONS = Set.of("photographer", "makeup", "logistics");
    private static final Set<String> VALID_STATUSES = Set.of("active", "inactive", "on_leave");

    public void validate() {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Mã người dùng (userId) không hợp lệ");
        }

        if (position == null || position.isBlank()) {
            throw new IllegalArgumentException("Vị trí nhân viên không được để trống");
        }
        if (!VALID_POSITIONS.contains(position.trim().toLowerCase())) {
            throw new IllegalArgumentException(
                    "Vị trí nhân viên không hợp lệ. Các vị trí hợp lệ: photographer, makeup, logistics");
        }

        if (status != null && !status.isBlank() && !VALID_STATUSES.contains(status.trim().toLowerCase())) {
            throw new IllegalArgumentException(
                    "Trạng thái nhân viên không hợp lệ. Các trạng thái hợp lệ: active, inactive, on_leave");
        }
    }
}
