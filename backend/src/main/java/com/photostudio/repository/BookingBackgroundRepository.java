package com.photostudio.repository;

import com.photostudio.model.bookings.BookingBackground;
import com.photostudio.model.bookings.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface BookingBackgroundRepository extends JpaRepository<BookingBackground, Long> {

    List<BookingBackground> findByBookingId(Long bookingId);

    Optional<BookingBackground> findByBookingIdAndBackgroundId(Long bookingId, Long backgroundId);

    boolean existsByBookingIdAndBackgroundIdAndIdNot(Long bookingId, Long backgroundId, Long id);

    @Query("SELECT COUNT(bb) > 0 FROM BookingBackground bb " +
            "WHERE bb.background.id = :backgroundId " +
            "AND bb.booking.status <> :cancelledStatus " +
            "AND FUNCTION('DATE', bb.booking.bookingDate) = FUNCTION('DATE', :bookingDate) " +
            "AND bb.booking.startTime < :endTime AND bb.booking.endTime > :startTime " +
            "AND bb.booking.id <> :bookingId")
    boolean existsConflictingBooking(
            @Param("backgroundId") Long backgroundId,
            @Param("bookingDate") LocalDateTime bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("cancelledStatus") BookingStatus cancelledStatus,
            @Param("bookingId") Long bookingId);

    void deleteByBookingId(Long bookingId);
}
