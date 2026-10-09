package com.photostudio.repository;

import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // List<Booking> findByCustomer(User customer);
    List<Booking> findByCustomerId(Long customerId);

    // List<Booking> findByRoom(Room room);
    List<Booking> findByRoomId(Long roomId);

    List<Booking> findByBookingDate(LocalDate bookingDate);

    List<Booking> findByStatus(BookingStatus status);

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.roomId = :roomId " +
            "AND b.bookingDate = :bookingDate " +
            "AND b.status != :cancelledStatus " +
            "AND (:id IS NULL OR b.id != :id) " +
            "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    boolean existsRoomBookingConflict(
            @Param("roomId") Long roomId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("cancelledStatus") BookingStatus cancelledStatus,
            @Param("id") Long id);
}
