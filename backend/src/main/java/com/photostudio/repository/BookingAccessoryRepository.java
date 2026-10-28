package com.photostudio.repository;

import com.photostudio.model.bookings.BookingAccessory;
import com.photostudio.model.bookings.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.time.LocalTime;

import java.util.List;
import java.util.Optional;

public interface BookingAccessoryRepository extends JpaRepository<BookingAccessory, Long> {

    @Query("SELECT ba FROM BookingAccessory ba WHERE ba.booking.id = :bookingId")
    List<BookingAccessory> findByBookingId(@Param("bookingId") Long bookingId);

    @Query("SELECT ba FROM BookingAccessory ba WHERE ba.booking.id = :bookingId AND ba.accessory.id = :accessoryId")
    Optional<BookingAccessory> findByBookingIdAndAccessoryId(
            @Param("bookingId") Long bookingId,
            @Param("accessoryId") Long accessoryId);

    @Query("SELECT COALESCE(SUM(ba.quantity), 0) FROM BookingAccessory ba " +
            "WHERE ba.accessory.id = :accessoryId " +
            "AND ba.booking.status <> :cancelledStatus " +
            "AND FUNCTION('DATE', ba.booking.bookingDate) = FUNCTION('DATE', :bookingDate) " +
            "AND ba.booking.startTime < :endTime AND ba.booking.endTime > :startTime " +
            "AND (:excludeId IS NULL OR ba.id <> :excludeId)")
    Long sumReservedQuantityForOverlappingBookings(
            @Param("accessoryId") Long accessoryId,
            @Param("bookingDate") LocalDateTime bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("cancelledStatus") BookingStatus cancelledStatus,
            @Param("excludeId") Long excludeId);

    void deleteByBookingId(Long bookingId);
}
