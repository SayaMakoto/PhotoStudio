package com.photostudio.repository;

import com.photostudio.model.bookings.BookingEquipment;
import com.photostudio.model.bookings.BookingEquipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingEquipmentRepository extends JpaRepository<BookingEquipment, Long> {

    List<BookingEquipment> findByBooking_Id(Long bookingId);

    List<BookingEquipment> findByEquipment_Id(Long equipmentId);

    List<BookingEquipment> findByStatus(BookingEquipmentStatus status);

    boolean existsByEquipment_IdAndStatus(Long equipmentId, BookingEquipmentStatus status);

    boolean existsByEquipment_Id(Long equipmentId);

    void deleteByBooking_Id(Long bookingId);
}
