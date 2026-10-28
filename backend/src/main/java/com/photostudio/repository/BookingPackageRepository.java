package com.photostudio.repository;

import com.photostudio.model.bookings.BookingPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookingPackageRepository extends JpaRepository<BookingPackage, Long> {

    List<BookingPackage> findByBookingId(Long bookingId);

    List<BookingPackage> findByPackageEntityId(Long packageId);

    Optional<BookingPackage> findByBookingIdAndPackageEntityId(Long bookingId, Long packageId);

    @Query("SELECT CASE WHEN COUNT(bp) > 0 THEN true ELSE false END FROM BookingPackage bp WHERE bp.packageEntity.id = :packageId")
    boolean existsBookingReference(@Param("packageId") Long packageId);

    void deleteByBookingId(Long bookingId);
}
