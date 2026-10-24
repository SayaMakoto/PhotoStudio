package com.photostudio.dto.bookings;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingBackgroundRequest {

    private Long bookingId;
    private Long backgroundId;

    public void validate() {
        if (bookingId == null || bookingId <= 0) {
            throw new IllegalArgumentException("Mã đơn đặt lịch (bookingId) không hợp lệ");
        }
        if (backgroundId == null || backgroundId <= 0) {
            throw new IllegalArgumentException("Mã bối cảnh (backgroundId) không hợp lệ");
        }
    }
}
