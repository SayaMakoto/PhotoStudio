package com.photostudio.dto.notifications;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {

    private Long userId;
    // Ghi chú: userId là người nhận thông báo (kiểm tra tồn tại ở Service)

    private String title;

    private String message;

    private String type;

    private static final Set<String> VALID_TYPES = Set.of(
            "booking", "payment", "employee_assignment", "equipment", "system");

    public void validate() {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Mã người nhận (userId) không hợp lệ");
        }
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Tiêu đề thông báo (title) không được để trống");
        }
        if (title.length() > 255) {
            throw new IllegalArgumentException("Tiêu đề thông báo tối đa 255 ký tự");
        }
        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException("Nội dung thông báo (message) không được để trống");
        }
        if (message.length() > 255) {
            throw new IllegalArgumentException("Nội dung thông báo tối đa 255 ký tự");
        }
        if (type == null || type.isBlank()) {
            throw new IllegalArgumentException("Loại thông báo (type) không được để trống");
        }
        if (!VALID_TYPES.contains(type.trim().toLowerCase())) {
            throw new IllegalArgumentException(
                    "Loại thông báo không hợp lệ. Hợp lệ: booking, payment, employee_assignment, equipment, system");
        }
    }
}
