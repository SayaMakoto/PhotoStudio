package com.photostudio.dto.bookings;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class BookingServiceRequest {
    private Long bookingId;
    private Long serviceId;
    private Integer quantity;
    private Double unitPrice;

    public void validate() {
        if (bookingId == null || bookingId <= 0) throw new IllegalArgumentException("Mã đơn đặt lịch (bookingId) không hợp lệ");
        if (serviceId == null || serviceId <= 0) throw new IllegalArgumentException("Mã dịch vụ (serviceId) không hợp lệ");
        if (quantity != null && quantity <= 0) throw new IllegalArgumentException("Số lượng dịch vụ phải lớn hơn 0");
        if (unitPrice != null && (!Double.isFinite(unitPrice) || unitPrice < 0)) throw new IllegalArgumentException("Đơn giá dịch vụ không hợp lệ");
    }
}
