package com.photostudio.service.impl;

import com.photostudio.dto.payments.PaymentRequest;
import com.photostudio.dto.payments.PaymentResponse;
import com.photostudio.mapper.PaymentMapper;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.payments.Payment;
import com.photostudio.model.payments.PaymentStatus;
import com.photostudio.repository.BookingRepository;
import com.photostudio.repository.PaymentRepository;
import com.photostudio.service.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private static final String INVALID_STATUS_MSG =
            "Trạng thái thanh toán không hợp lệ. Các trạng thái hợp lệ: pending, paid, failed, refunded";

    private final PaymentRepository repository;
    private final BookingRepository bookingRepository;

    public PaymentServiceImpl(PaymentRepository repository, BookingRepository bookingRepository) {
        this.repository = repository;
        this.bookingRepository = bookingRepository;
    }

    private Payment findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy giao dịch thanh toán có id: " + id));
    }

    private Booking findBooking(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy đơn đặt lịch có id: " + bookingId));
    }

    private PaymentStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Trạng thái không được để trống");
        }
        try {
            return PaymentStatus.valueOf(status.trim().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(INVALID_STATUS_MSG);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> findAll() {
        return repository.findAll().stream().map(PaymentMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse findById(Long id) {
        return PaymentMapper.toResponse(findEntity(id));
    }

    @Override
    public PaymentResponse create(PaymentRequest request) {
        request.validate();

        Booking booking = findBooking(request.getBookingId());

        Payment saved = repository.save(PaymentMapper.toEntity(request, booking));
        return PaymentMapper.toResponse(saved);
    }

    @Override
    public PaymentResponse update(Long id, PaymentRequest request) {
        request.validate();

        Payment payment = findEntity(id);
        Booking booking = findBooking(request.getBookingId());

        PaymentMapper.updateEntity(request, payment, booking);
        return PaymentMapper.toResponse(repository.save(payment));
    }

    @Override
    public PaymentResponse updateStatus(Long id, String status) {
        PaymentStatus paymentStatus = parseStatus(status);

        Payment payment = findEntity(id);
        payment.setStatus(paymentStatus);
        return PaymentMapper.toResponse(repository.save(payment));
    }

    @Override
    public void delete(Long id) {
        repository.delete(findEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> findByBookingId(Long bookingId) {
        if (bookingId == null || bookingId <= 0) {
            throw new IllegalArgumentException("Mã đơn đặt lịch không hợp lệ");
        }
        return repository.findByBookingId(bookingId).stream().map(PaymentMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> findByStatus(String status) {
        return repository.findByStatus(parseStatus(status)).stream().map(PaymentMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getTotalPaidByBookingId(Long bookingId) {
        if (bookingId == null || bookingId <= 0) {
            throw new IllegalArgumentException("Mã đơn đặt lịch không hợp lệ");
        }
        findBooking(bookingId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("bookingId", bookingId);
        result.put("totalPaid", repository.sumAmountByBookingIdAndStatus(bookingId, PaymentStatus.paid));
        return result;
    }
}
