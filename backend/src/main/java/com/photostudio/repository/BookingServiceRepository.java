package com.photostudio.repository;

import com.photostudio.model.bookings.BookingService;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookingServiceRepository extends JpaRepository<BookingService, Long> {
    List<BookingService> findByBookingId(Long bookingId);
    Optional<BookingService> findByBookingIdAndServiceId(Long bookingId, Long serviceId);
    boolean existsByBookingIdAndServiceIdAndIdNot(Long bookingId, Long serviceId, Long id);
}
