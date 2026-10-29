package com.photostudio.repository;

import com.photostudio.model.bookings.BookingEmployeeAssignment;
import com.photostudio.model.bookings.BookingEmployeeAssignmentStatus;
import com.photostudio.model.bookings.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public interface BookingEmployeeAssignmentRepository extends JpaRepository<BookingEmployeeAssignment, Long> {

    @Modifying
    @Query("UPDATE BookingEmployeeAssignment a SET a.status = :newStatus WHERE a.booking.id = :bookingId AND a.status = :currentStatus")
    int releaseAssignedEmployees(@Param("bookingId") Long bookingId,
            @Param("currentStatus") BookingEmployeeAssignmentStatus currentStatus,
            @Param("newStatus") BookingEmployeeAssignmentStatus newStatus);

    @Query("SELECT a FROM BookingEmployeeAssignment a WHERE a.booking.id = :bookingId")
    List<BookingEmployeeAssignment> findByBookingId(@Param("bookingId") Long bookingId);

    @Query("SELECT a FROM BookingEmployeeAssignment a WHERE a.booking.id = :bookingId AND a.employee.id = :employeeId ORDER BY a.assignedAt DESC, a.id DESC")
    List<BookingEmployeeAssignment> findByBookingIdAndEmployeeId(
            @Param("bookingId") Long bookingId,
            @Param("employeeId") Long employeeId);

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
