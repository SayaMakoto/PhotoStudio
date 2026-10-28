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

    @Query("SELECT CASE WHEN COUNT(bb) > 0 THEN true ELSE false END FROM BookingBackground bb WHERE bb.background.id = :backgroundId")
    boolean existsByBackgroundId(@Param("backgroundId") Long backgroundId);

    @Query("SELECT bb FROM BookingBackground bb WHERE bb.booking.id = :bookingId")
    List<BookingBackground> findByBookingId(@Param("bookingId") Long bookingId);

    @Query("SELECT bb FROM BookingBackground bb WHERE bb.booking.id = :bookingId AND bb.background.id = :backgroundId")
    Optional<BookingBackground> findByBookingIdAndBackgroundId(
            @Param("bookingId") Long bookingId,
            @Param("backgroundId") Long backgroundId);

    @Query("SELECT CASE WHEN COUNT(bb) > 0 THEN true ELSE false END FROM BookingBackground bb " +
            "WHERE bb.booking.id = :bookingId AND bb.background.id = :backgroundId AND bb.id <> :id")
    boolean existsByBookingIdAndBackgroundIdAndIdNot(
            @Param("bookingId") Long bookingId,
            @Param("backgroundId") Long backgroundId,
            @Param("id") Long id);

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
