package com.photostudio.repository;

import com.photostudio.model.bookings.BookingPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface BookingPackageRepository extends JpaRepository<BookingPackage, Long> {

    @Query("SELECT bp FROM BookingPackage bp WHERE bp.booking.id = :bookingId")
    List<BookingPackage> findByBookingId(@Param("bookingId") Long bookingId);

    @Query("SELECT bp FROM BookingPackage bp WHERE bp.packageEntity.id = :packageId")
    List<BookingPackage> findByPackageEntityId(@Param("packageId") Long packageId);

    @Query("SELECT bp FROM BookingPackage bp WHERE bp.booking.id = :bookingId AND bp.packageEntity.id = :packageId")
    Optional<BookingPackage> findByBookingIdAndPackageEntityId(
            @Param("bookingId") Long bookingId,
            @Param("packageId") Long packageId);

    @Query("SELECT CASE WHEN COUNT(bp) > 0 THEN true ELSE false END FROM BookingPackage bp WHERE bp.packageEntity.id = :packageId")
    boolean existsBookingReference(@Param("packageId") Long packageId);

    @Modifying
    @Transactional
    @Query("DELETE FROM BookingPackage bp WHERE bp.booking.id = :bookingId")
    void deleteByBookingId(@Param("bookingId") Long bookingId);
}
