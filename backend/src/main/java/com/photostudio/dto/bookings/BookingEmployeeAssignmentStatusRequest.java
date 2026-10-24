package com.photostudio.dto.bookings;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingEmployeeAssignmentStatusRequest {

    private String status;
    private String note;

    public void validate() {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Trạng thái phân công không được để trống");
        }
        String normalized = status.trim().toLowerCase();
        if (!normalized.equals("assigned") && !normalized.equals("completed") && !normalized.equals("cancelled")) {
            throw new IllegalArgumentException("Trạng thái phân công không hợp lệ. Hợp lệ: assigned, completed, cancelled");
        }
        if (note != null && note.length() > 255) {
            throw new IllegalArgumentException("Ghi chú phân công tối đa 255 ký tự");
        }
    }
}
