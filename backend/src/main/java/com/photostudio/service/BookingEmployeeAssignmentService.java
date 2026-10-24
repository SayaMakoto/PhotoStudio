package com.photostudio.service;

import com.photostudio.dto.bookings.BookingEmployeeAssignmentRequest;
import com.photostudio.dto.bookings.BookingEmployeeAssignmentResponse;
import com.photostudio.dto.bookings.BookingEmployeeAssignmentStatusRequest;

import java.util.List;

public interface BookingEmployeeAssignmentService {

    List<BookingEmployeeAssignmentResponse> getAssignmentsByBookingId(Long bookingId);

    BookingEmployeeAssignmentResponse getById(Long id);

    BookingEmployeeAssignmentResponse assignEmployeeToBooking(BookingEmployeeAssignmentRequest request);

    BookingEmployeeAssignmentResponse updateStatus(Long id, BookingEmployeeAssignmentStatusRequest request);

    void removeAssignment(Long id);
}
