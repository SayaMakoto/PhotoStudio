package com.photostudio.repository;

import com.photostudio.model.bookings.BookingEquipment;
import com.photostudio.model.bookings.BookingEquipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingEquipmentRepository extends JpaRepository<BookingEquipment, Long> {

    List<BookingEquipment> findByBookingId(Long bookingId);

    List<BookingEquipment> findByEquipmentId(Long equipmentId);

    List<BookingEquipment> findByStatus(BookingEquipmentStatus status);

    boolean existsByEquipmentIdAndStatus(Long equipmentId, BookingEquipmentStatus status);

    void deleteByBookingId(Long bookingId);
}
