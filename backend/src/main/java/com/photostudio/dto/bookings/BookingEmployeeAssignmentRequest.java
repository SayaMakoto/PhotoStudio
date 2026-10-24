package com.photostudio.dto.bookings;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingEmployeeAssignmentRequest {

    private Long bookingId;
    private Long employeeId;
    private String note;

    public void validate() {
        if (bookingId == null || bookingId <= 0) {
            throw new IllegalArgumentException("Mã đơn đặt lịch (bookingId) không hợp lệ");
        }
        if (employeeId == null || employeeId <= 0) {
            throw new IllegalArgumentException("Mã nhân viên (employeeId) không hợp lệ");
        }
        if (note != null && note.length() > 255) {
            throw new IllegalArgumentException("Ghi chú phân công tối đa 255 ký tự");
        }
    }
}
