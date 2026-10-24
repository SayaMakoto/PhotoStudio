package com.photostudio.repository;

import com.photostudio.model.bookings.BookingEmployeeAssignment;
import com.photostudio.model.bookings.BookingEmployeeAssignmentStatus;
import com.photostudio.model.bookings.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface BookingEmployeeAssignmentRepository extends JpaRepository<BookingEmployeeAssignment, Long> {

    List<BookingEmployeeAssignment> findByBookingId(Long bookingId);

    Optional<BookingEmployeeAssignment> findByBookingIdAndEmployeeId(Long bookingId, Long employeeId);

    @Query("SELECT COUNT(a) > 0 FROM BookingEmployeeAssignment a " +
            "WHERE a.employee.id = :employeeId " +
            "AND a.status = :assignedStatus " +
            "AND a.booking.status <> :cancelledBookingStatus " +
            "AND FUNCTION('DATE', a.booking.bookingDate) = FUNCTION('DATE', :bookingDate) " +
            "AND a.booking.startTime < :endTime AND a.booking.endTime > :startTime " +
            "AND a.booking.id <> :bookingId")
    boolean existsConflictingAssignment(
            @Param("employeeId") Long employeeId,
            @Param("assignedStatus") BookingEmployeeAssignmentStatus assignedStatus,
            @Param("cancelledBookingStatus") BookingStatus cancelledBookingStatus,
            @Param("bookingDate") LocalDateTime bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("bookingId") Long bookingId);
}
