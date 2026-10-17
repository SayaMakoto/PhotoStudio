package com.photostudio.dto.payments;

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
public class PaymentRequest {

    private Long bookingId;
    private String paymentMethod;
    private Double amount;
    private LocalDateTime paidAt;
    private String note;
    private String status;

    private static final Set<String> VALID_METHODS = Set.of("cash", "vnpay", "credit_card");
    private static final Set<String> VALID_STATUSES = Set.of("pending", "paid", "failed", "refunded");

    public void validate() {
        if (bookingId == null || bookingId <= 0) {
            throw new IllegalArgumentException("Mã đơn đặt lịch (bookingId) không hợp lệ");
        }

        if (paymentMethod == null || paymentMethod.isBlank()) {
            throw new IllegalArgumentException("Phương thức thanh toán không được để trống");
        }
        if (!VALID_METHODS.contains(paymentMethod.trim().toLowerCase())) {
            throw new IllegalArgumentException(
                    "Phương thức thanh toán không hợp lệ. Các phương thức hợp lệ: cash, vnpay, credit_card");
        }

        if (amount == null) {
            throw new IllegalArgumentException("Số tiền thanh toán không được để trống");
        }
        if (amount <= 0) {
            throw new IllegalArgumentException("Số tiền thanh toán phải lớn hơn 0");
        }

        if (note != null && note.length() > 255) {
            throw new IllegalArgumentException("Ghi chú thanh toán tối đa 255 ký tự");
        }

        if (status != null && !status.isBlank() && !VALID_STATUSES.contains(status.trim().toLowerCase())) {
            throw new IllegalArgumentException(
                    "Trạng thái thanh toán không hợp lệ. Các trạng thái hợp lệ: pending, paid, failed, refunded");
        }
    }
}
