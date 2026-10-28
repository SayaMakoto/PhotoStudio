package com.photostudio.repository;

import com.photostudio.model.bookings.BookingService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface BookingServiceRepository extends JpaRepository<BookingService, Long> {
    @Query("SELECT bs FROM BookingService bs WHERE bs.booking.id = :bookingId")
    List<BookingService> findByBookingId(@Param("bookingId") Long bookingId);

    @Query("SELECT bs FROM BookingService bs WHERE bs.booking.id = :bookingId AND bs.service.id = :serviceId")
    Optional<BookingService> findByBookingIdAndServiceId(
            @Param("bookingId") Long bookingId,
            @Param("serviceId") Long serviceId);

    @Query("SELECT COUNT(bs) > 0 FROM BookingService bs WHERE bs.booking.id = :bookingId " +
            "AND bs.service.id = :serviceId AND bs.id <> :id")
    boolean existsByBookingIdAndServiceIdAndIdNot(
            @Param("bookingId") Long bookingId,
            @Param("serviceId") Long serviceId,
            @Param("id") Long id);

    @Query("SELECT CASE WHEN COUNT(bs) > 0 THEN true ELSE false END FROM BookingService bs WHERE bs.service.id = :serviceId")
    boolean existsByServiceId(@Param("serviceId") Long serviceId);
}
