package com.photostudio.dto.bookings;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {

    private Long customerId;
    // Ghi chú: Khi có bảng users, có thể mở rộng kiểm tra sự tồn tại của User
    // private String customerName;
    // private String customerPhone;

    private Long roomId;
    // Ghi chú: Khi có bảng rooms, có thể mở rộng kiểm tra sự tồn tại của Room
    // private String roomName;

    private LocalDateTime bookingDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private String status;

    private String customerNote;

    private static final Set<String> VALID_STATUSES = Set.of(
            "pending", "confirmed", "in_progress", "completed", "cancelled");

    public void validate() {
        if (customerId == null || customerId <= 0) {
            throw new IllegalArgumentException("Mã khách hàng (customerId) không hợp lệ");
        }

        if (roomId == null || roomId <= 0) {
            throw new IllegalArgumentException("Mã phòng chụp (roomId) không hợp lệ");
        }

        if (bookingDate == null) {
            throw new IllegalArgumentException("Ngày đặt lịch (bookingDate) không được để trống");
        }

        if (startTime == null) {
            throw new IllegalArgumentException("Thời gian bắt đầu (startTime) không được để trống");
        }

        if (endTime == null) {
            throw new IllegalArgumentException("Thời gian kết thúc (endTime) không được để trống");
        }

        if (!endTime.isAfter(startTime)) {
            throw new IllegalArgumentException("Thời gian kết thúc phải sau thời gian bắt đầu");
        }

        if (status != null && !VALID_STATUSES.contains(status.trim().toLowerCase())) {
            throw new IllegalArgumentException("Trạng thái đặt lịch không hợp lệ. Hợp lệ: pending, confirmed, in_progress, completed, cancelled");
        }

        if (customerNote != null && customerNote.length() > 255) {
            throw new IllegalArgumentException("Ghi chú của khách hàng tối đa 255 ký tự");
        }
    }
}
