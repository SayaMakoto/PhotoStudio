package com.photostudio.repository;

import com.photostudio.model.payments.Payment;
import com.photostudio.model.payments.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Lịch sử thanh toán của một đơn booking
    @Query("SELECT p FROM Payment p WHERE p.booking.id = :bookingId ORDER BY p.paidAt ASC")
    List<Payment> findByBookingId(@Param("bookingId") Long bookingId);

    List<Payment> findByStatus(PaymentStatus status);

    // Tổng tiền đã thanh toán thành công của một booking
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p "
            + "WHERE p.booking.id = :bookingId AND p.status = :status")
    Double sumAmountByBookingIdAndStatus(
            @Param("bookingId") Long bookingId,
            @Param("status") PaymentStatus status);
}
