package com.photostudio.dto.bookings;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingClothingRequest {

    private Long bookingId;
    private Long clothId;
    private Integer quantity;

    public void validate() {
        if (bookingId == null || bookingId <= 0) {
            throw new IllegalArgumentException("Mã đơn đặt lịch (bookingId) không hợp lệ");
        }
        if (clothId == null || clothId <= 0) {
            throw new IllegalArgumentException("Mã trang phục (clothId) không hợp lệ");
        }
        if (quantity != null && quantity <= 0) {
            throw new IllegalArgumentException("Số lượng trang phục phải lớn hơn 0");
        }
    }
}
