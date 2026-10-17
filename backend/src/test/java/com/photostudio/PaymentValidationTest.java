package com.photostudio;

import com.photostudio.dto.payments.PaymentRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class PaymentValidationTest {

    private PaymentRequest valid() {
        return new PaymentRequest(1L, "vnpay", 500000.0, LocalDateTime.now(), "Đặt cọc 50%", "paid");
    }

    @Test
    @DisplayName("Dữ liệu hợp lệ thì không ném lỗi")
    void validRequest_passes() {
        assertDoesNotThrow(() -> valid().validate());
    }

    @Test
    @DisplayName("bookingId null hoặc <= 0 bị từ chối")
    void invalidBookingId_rejected() {
        PaymentRequest r = valid();
        r.setBookingId(null);
        assertThrows(IllegalArgumentException.class, r::validate);
        r.setBookingId(0L);
        assertThrows(IllegalArgumentException.class, r::validate);
    }

    @Test
    @DisplayName("Phương thức thanh toán trống hoặc sai bị từ chối")
    void invalidMethod_rejected() {
        PaymentRequest r = valid();
        r.setPaymentMethod(null);
        assertThrows(IllegalArgumentException.class, r::validate);
        r.setPaymentMethod("bitcoin");
        assertThrows(IllegalArgumentException.class, r::validate);
    }

    @Test
    @DisplayName("Số tiền phải lớn hơn 0")
    void amount_checked() {
        PaymentRequest r = valid();
        r.setAmount(null);
        assertThrows(IllegalArgumentException.class, r::validate);
        r.setAmount(0.0);
        assertThrows(IllegalArgumentException.class, r::validate);
        r.setAmount(-100.0);
        assertThrows(IllegalArgumentException.class, r::validate);
    }

    @Test
    @DisplayName("Trạng thái không hợp lệ bị từ chối, null được chấp nhận")
    void status_checked() {
        PaymentRequest r = valid();
        r.setStatus("cancelled");
        assertThrows(IllegalArgumentException.class, r::validate);
        r.setStatus(null);
        assertDoesNotThrow(r::validate);
    }
}
