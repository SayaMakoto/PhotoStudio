package com.photostudio.repository;

import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Tìm kiếm các lịch đặt theo mã khách hàng
    @Query("SELECT b FROM Booking b WHERE b.customer.id = :customerId")
    List<Booking> findByCustomerId(@Param("customerId") Long customerId);

    // Tìm kiếm các lịch đặt theo phòng chụp
    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId")
    List<Booking> findByRoomId(@Param("roomId") Long roomId);

    // Tìm kiếm theo chính xác thời điểm bookingDate
    List<Booking> findByBookingDate(LocalDateTime bookingDate);

    // Tìm kiếm các lịch đặt trong một khoảng thời gian
    List<Booking> findByBookingDateBetween(LocalDateTime start, LocalDateTime end);

    // Tìm kiếm các lịch đặt theo trạng thái
    List<Booking> findByStatus(BookingStatus status);

    // Kiểm tra trùng lịch đặt phòng trong cùng khung giờ ngày đó (trừ đơn đã hủy)
    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.room.id = :roomId " +
           "AND FUNCTION('DATE', b.bookingDate) = FUNCTION('DATE', :bookingDate) " +
           "AND b.status != :cancelledStatus " +
           "AND (:id IS NULL OR b.id != :id) " +
           "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    boolean existsRoomBookingConflict(
            @Param("roomId") Long roomId,
            @Param("bookingDate") LocalDateTime bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("cancelledStatus") BookingStatus cancelledStatus,
            @Param("id") Long id
    );
}
