package com.photostudio.repository;

import com.photostudio.model.bookings.BookingService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface BookingServiceRepository extends JpaRepository<BookingService, Long> {
    List<BookingService> findByBookingId(Long bookingId);
    Optional<BookingService> findByBookingIdAndServiceId(Long bookingId, Long serviceId);
    boolean existsByBookingIdAndServiceIdAndIdNot(Long bookingId, Long serviceId, Long id);

    @Query("SELECT CASE WHEN COUNT(bs) > 0 THEN true ELSE false END FROM BookingService bs WHERE bs.service.id = :serviceId")
    boolean existsByServiceId(@Param("serviceId") Long serviceId);
}
