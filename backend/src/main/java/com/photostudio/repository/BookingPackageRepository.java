package com.photostudio.repository;

import com.photostudio.model.bookings.BookingPackage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingPackageRepository extends JpaRepository<BookingPackage, Long> {

    List<BookingPackage> findByBookingId(Long bookingId);

    List<BookingPackage> findByPackageEntityId(Long packageId);

    Optional<BookingPackage> findByBookingIdAndPackageEntityId(Long bookingId, Long packageId);

    void deleteByBookingId(Long bookingId);
}
