package com.photostudio.mapper;

import com.photostudio.dto.payments.PaymentRequest;
import com.photostudio.dto.payments.PaymentResponse;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.payments.Payment;
import com.photostudio.model.payments.PaymentMethod;
import com.photostudio.model.payments.PaymentStatus;

public class PaymentMapper {

    public static Payment toEntity(PaymentRequest request, Booking booking) {
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setPaymentMethod(PaymentMethod.valueOf(request.getPaymentMethod().trim().toLowerCase()));
        payment.setAmount(request.getAmount());
        payment.setPaidAt(request.getPaidAt()); // null -> @PrePersist tự gán thời điểm hiện tại
        payment.setNote(request.getNote());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            payment.setStatus(PaymentStatus.valueOf(request.getStatus().trim().toLowerCase()));
        } else {
            payment.setStatus(PaymentStatus.pending);
        }

        return payment;
    }

    public static void updateEntity(PaymentRequest request, Payment payment, Booking booking) {
        payment.setBooking(booking);
        payment.setPaymentMethod(PaymentMethod.valueOf(request.getPaymentMethod().trim().toLowerCase()));
        payment.setAmount(request.getAmount());
        if (request.getPaidAt() != null) {
            payment.setPaidAt(request.getPaidAt());
        }
        payment.setNote(request.getNote());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            payment.setStatus(PaymentStatus.valueOf(request.getStatus().trim().toLowerCase()));
        }
    }

    public static PaymentResponse toResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getBooking() != null ? payment.getBooking().getId() : null,
                payment.getPaymentMethod() != null ? payment.getPaymentMethod().name() : null,
                payment.getAmount(),
                payment.getPaidAt(),
                payment.getNote(),
                payment.getStatus() != null ? payment.getStatus().name() : null
        );
    }
}
