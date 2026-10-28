package com.photostudio.repository;

import com.photostudio.model.bookings.BookingEquipment;
import com.photostudio.model.bookings.BookingEquipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingEquipmentRepository extends JpaRepository<BookingEquipment, Long> {

    @Query("SELECT be FROM BookingEquipment be WHERE be.booking.id = :bookingId")
    List<BookingEquipment> findByBookingId(@Param("bookingId") Long bookingId);

    List<BookingEquipment> findByEquipment_Id(Long equipmentId);

    List<BookingEquipment> findByStatus(BookingEquipmentStatus status);

    @Query("SELECT CASE WHEN COUNT(be) > 0 THEN true ELSE false END FROM BookingEquipment be " +
            "WHERE be.equipment.id = :equipmentId AND be.status = :status")
    boolean existsByEquipmentIdAndStatus(
            @Param("equipmentId") Long equipmentId,
            @Param("status") BookingEquipmentStatus status);

    boolean existsByEquipment_Id(Long equipmentId);

    void deleteByBooking_Id(Long bookingId);
}
