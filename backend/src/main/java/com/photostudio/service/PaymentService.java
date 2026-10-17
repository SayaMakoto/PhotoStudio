package com.photostudio.service;

import com.photostudio.dto.payments.PaymentRequest;
import com.photostudio.dto.payments.PaymentResponse;

import java.util.List;
import java.util.Map;

public interface PaymentService {

    List<PaymentResponse> findAll();

    PaymentResponse findById(Long id);

    PaymentResponse create(PaymentRequest request);

    PaymentResponse update(Long id, PaymentRequest request);

    PaymentResponse updateStatus(Long id, String status);

    void delete(Long id);

    List<PaymentResponse> findByBookingId(Long bookingId);

    List<PaymentResponse> findByStatus(String status);

    Map<String, Object> getTotalPaidByBookingId(Long bookingId);
}
