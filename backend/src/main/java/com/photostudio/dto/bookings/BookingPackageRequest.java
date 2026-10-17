package com.photostudio.dto.bookings;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingPackageRequest {

    private Long bookingId;
    private Long packageId;
    private Integer quantity;
    private Double unitPrice;

    public void validate() {
        if (bookingId == null || bookingId <= 0) {
            throw new IllegalArgumentException("Mã đơn đặt lịch (bookingId) không hợp lệ");
        }

        if (packageId == null || packageId <= 0) {
            throw new IllegalArgumentException("Mã gói chụp (packageId) không hợp lệ");
        }

        if (quantity != null && quantity <= 0) {
            throw new IllegalArgumentException("Số lượng gói chụp phải lớn hơn 0");
        }

        if (unitPrice != null && unitPrice < 0) {
            throw new IllegalArgumentException("Đơn giá gói chụp không được âm");
        }
    }
}
