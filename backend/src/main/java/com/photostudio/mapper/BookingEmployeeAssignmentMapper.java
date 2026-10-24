package com.photostudio.mapper;

import com.photostudio.dto.bookings.BookingEmployeeAssignmentRequest;
import com.photostudio.dto.bookings.BookingEmployeeAssignmentResponse;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingEmployeeAssignment;
import com.photostudio.model.employees.Employee;
import org.springframework.stereotype.Component;

@Component
public class BookingEmployeeAssignmentMapper {

    public BookingEmployeeAssignment toEntity(
            BookingEmployeeAssignmentRequest request, Booking booking, Employee employee) {
        BookingEmployeeAssignment assignment = new BookingEmployeeAssignment();
        assignment.setBooking(booking);
        assignment.setEmployee(employee);
        assignment.setNote(request.getNote());
        return assignment;
    }

    public BookingEmployeeAssignmentResponse toResponse(BookingEmployeeAssignment assignment) {
        Employee employee = assignment.getEmployee();
        return new BookingEmployeeAssignmentResponse(
                assignment.getId(),
                assignment.getBookingId(),
                employee != null ? employee.getId() : null,
                employee != null && employee.getUser() != null ? employee.getUser().getFullname() : null,
                employee != null && employee.getUser() != null ? employee.getUser().getPhone() : null,
                employee != null && employee.getPosition() != null ? employee.getPosition().name() : null,
                assignment.getAssignedAt(),
                assignment.getStatus() != null ? assignment.getStatus().name() : null,
                assignment.getNote());
    }
}
