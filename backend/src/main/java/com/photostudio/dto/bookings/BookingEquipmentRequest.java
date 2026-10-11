package com.photostudio.dto.bookings;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingEquipmentRequest {

    private Long bookingId;
    private Long equipmentId;
    private LocalDateTime assignedAt;
    private String status;
    private String note;

    private static final Set<String> VALID_STATUSES = Set.of("assigned", "returned", "cancelled");

    public void validate() {
        if (bookingId == null || bookingId <= 0) {
            throw new IllegalArgumentException("Mã đơn đặt lịch (bookingId) không hợp lệ");
        }

        if (equipmentId == null || equipmentId <= 0) {
            throw new IllegalArgumentException("Mã thiết bị (equipmentId) không hợp lệ");
        }

        if (status != null && !VALID_STATUSES.contains(status.trim().toLowerCase())) {
            throw new IllegalArgumentException("Trạng thái cấp phát không hợp lệ. Hợp lệ: assigned, returned, cancelled");
        }

        if (note != null && note.length() > 255) {
            throw new IllegalArgumentException("Ghi chú tối đa 255 ký tự");
        }
    }
}
