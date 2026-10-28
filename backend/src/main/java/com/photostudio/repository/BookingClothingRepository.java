package com.photostudio.repository;

import com.photostudio.model.bookings.BookingClothing;
import com.photostudio.model.bookings.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface BookingClothingRepository extends JpaRepository<BookingClothing, Long> {

    @Query("SELECT bc FROM BookingClothing bc WHERE bc.booking.id = :bookingId")
    List<BookingClothing> findByBookingId(@Param("bookingId") Long bookingId);

    @Query("SELECT bc FROM BookingClothing bc WHERE bc.booking.id = :bookingId AND bc.cloth.id = :clothId")
    Optional<BookingClothing> findByBookingIdAndClothId(
            @Param("bookingId") Long bookingId,
            @Param("clothId") Long clothId);

    @Query("SELECT COUNT(bc) > 0 FROM BookingClothing bc WHERE bc.booking.id = :bookingId " +
            "AND bc.cloth.id = :clothId AND bc.id <> :id")
    boolean existsByBookingIdAndClothIdAndIdNot(
            @Param("bookingId") Long bookingId,
            @Param("clothId") Long clothId,
            @Param("id") Long id);

    @Query("SELECT COUNT(bc) > 0 FROM BookingClothing bc " +
            "WHERE bc.cloth.id = :clothId " +
            "AND bc.booking.status <> :cancelledStatus " +
            "AND FUNCTION('DATE', bc.booking.bookingDate) = FUNCTION('DATE', :bookingDate) " +
            "AND bc.booking.startTime < :endTime AND bc.booking.endTime > :startTime " +
            "AND bc.booking.id <> :bookingId")
    boolean existsConflictingBooking(
            @Param("clothId") Long clothId,
            @Param("bookingDate") LocalDateTime bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("cancelledStatus") BookingStatus cancelledStatus,
            @Param("bookingId") Long bookingId);

    void deleteByBookingId(Long bookingId);
}
