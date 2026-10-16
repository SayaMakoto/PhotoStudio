package com.photostudio.dto.bookings;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingAccessoryRequest {

    private Long bookingId;
    private Long accessoryId;
    private Integer quantity;

    public void validate() {
        if (bookingId == null || bookingId <= 0) {
            throw new IllegalArgumentException("Mã đơn đặt lịch (bookingId) không hợp lệ");
        }
        if (accessoryId == null || accessoryId <= 0) {
            throw new IllegalArgumentException("Mã phụ kiện (accessoryId) không hợp lệ");
        }
        if (quantity != null && quantity <= 0) {
            throw new IllegalArgumentException("Số lượng phụ kiện phải lớn hơn 0");
        }
    }
}
