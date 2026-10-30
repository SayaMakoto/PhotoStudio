package com.photostudio.service.impl;

import com.photostudio.dto.bookings.BookingEmployeeAssignmentRequest;
import com.photostudio.dto.bookings.BookingEmployeeAssignmentResponse;
import com.photostudio.dto.bookings.BookingEmployeeAssignmentStatusRequest;
import com.photostudio.mapper.BookingEmployeeAssignmentMapper;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingEmployeeAssignment;
import com.photostudio.model.bookings.BookingEmployeeAssignmentStatus;
import com.photostudio.model.bookings.BookingStatus;
import com.photostudio.model.employees.Employee;
import com.photostudio.model.employees.EmployeeStatus;
import com.photostudio.model.users.UserRole;
import com.photostudio.model.users.UserStatus;
import com.photostudio.repository.BookingEmployeeAssignmentRepository;
import com.photostudio.repository.BookingRepository;
import com.photostudio.repository.EmployeeRepository;
import com.photostudio.service.BookingEmployeeAssignmentService;
import com.photostudio.dto.notifications.NotificationRequest;
import com.photostudio.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BookingEmployeeAssignmentServiceImpl implements BookingEmployeeAssignmentService {

    private final BookingEmployeeAssignmentRepository assignmentRepository;
    private final BookingRepository bookingRepository;
    private final EmployeeRepository employeeRepository;
    private final BookingEmployeeAssignmentMapper assignmentMapper;
    private final NotificationService notificationService;

    @Override
    @Transactional(readOnly = true)
    public List<BookingEmployeeAssignmentResponse> getAssignmentsByBookingId(Long bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new IllegalArgumentException("Không tìm thấy đơn đặt lịch với ID: " + bookingId);
        }
        return assignmentRepository.findByBookingId(bookingId).stream()
                .map(assignmentMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingEmployeeAssignmentResponse getById(Long id) {
        return assignmentRepository.findById(id)
                .map(assignmentMapper::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phân công nhân viên với ID: " + id));
    }

    @Override
    public BookingEmployeeAssignmentResponse assignEmployeeToBooking(BookingEmployeeAssignmentRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu yêu cầu không được để trống");
        }
        request.validate();

        Booking booking = findBookableBooking(request.getBookingId());
        Employee employee = findActiveEmployee(request.getEmployeeId());

        var existingAssignments = assignmentRepository.findByBookingIdAndEmployeeId(booking.getId(), employee.getId());
        var activeAssignment = existingAssignments.stream()
                .filter(assignment -> assignment.getStatus() != BookingEmployeeAssignmentStatus.cancelled)
                .findFirst();
        if (activeAssignment.isPresent()) {
            return assignmentMapper.toResponse(activeAssignment.get());
        }
        ensureNoScheduleConflict(employee, booking);

        BookingEmployeeAssignment assignment = assignmentMapper.toEntity(request, booking, employee);
        BookingEmployeeAssignment saved = assignmentRepository.save(assignment);

        try {
            if (employee.getUser() != null && employee.getUser().getId() != null) {
                NotificationRequest noti = new NotificationRequest();
                noti.setUserId(employee.getUser().getId());
                noti.setTitle("Nhiệm vụ ca chụp mới");
                String roomName = booking.getRoom() != null ? booking.getRoom().getName() : "Studio Photo";
                String timeStr = (booking.getStartTime() != null ? booking.getStartTime().toString().substring(0, 5) : "")
                        + " - " + (booking.getEndTime() != null ? booking.getEndTime().toString().substring(0, 5) : "");
                String dateStr = booking.getBookingDate() != null ? booking.getBookingDate().toLocalDate().toString() : "";
                noti.setMessage("Admin đã phân công bạn vào đơn đặt lịch #" + booking.getId() + " (" + roomName + ") lúc " + timeStr + " ngày " + dateStr);
                noti.setType("employee_assignment");
                notificationService.create(noti);
            }
        } catch (Exception e) {
            log.warn("Không thể tạo thông báo phân công cho nhân viên: {}", e.getMessage());
        }

        return assignmentMapper.toResponse(saved);
    }

    @Override
    public BookingEmployeeAssignmentResponse updateStatus(
            Long id, BookingEmployeeAssignmentStatusRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu yêu cầu không được để trống");
        }
        request.validate();

        BookingEmployeeAssignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phân công nhân viên với ID: " + id));
        BookingEmployeeAssignmentStatus newStatus = BookingEmployeeAssignmentStatus.valueOf(
                request.getStatus().trim().toLowerCase());

        if (newStatus == BookingEmployeeAssignmentStatus.assigned) {
            Booking booking = findBookableBooking(assignment.getBookingId());
            findActiveEmployee(assignment.getEmployeeId());
            ensureNoScheduleConflict(assignment.getEmployee(), booking);
        }

        assignment.setStatus(newStatus);
        if (request.getNote() != null) {
            assignment.setNote(request.getNote());
        }
        return assignmentMapper.toResponse(assignmentRepository.save(assignment));
    }

    @Override
    public void removeAssignment(Long id) {
        if (!assignmentRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy phân công nhân viên với ID: " + id);
        }
        assignmentRepository.deleteById(id);
    }

    private Booking findBookableBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn đặt lịch với ID: " + bookingId));
        if (booking.getStatus() == BookingStatus.cancelled || booking.getStatus() == BookingStatus.completed) {
            throw new IllegalArgumentException("Không thể phân công nhân viên cho đơn đã hủy hoặc hoàn thành");
        }
        return booking;
    }

    private Employee findActiveEmployee(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân viên với ID: " + employeeId));
        if (employee.getStatus() != EmployeeStatus.active) {
            throw new IllegalArgumentException("Nhân viên có ID: " + employeeId + " hiện không hoạt động");
        }
        if (employee.getUser() == null || employee.getUser().getRole() != UserRole.Employee
                || employee.getUser().getStatus() != UserStatus.active) {
            throw new IllegalArgumentException("Tài khoản của nhân viên có ID: " + employeeId + " hiện không hoạt động");
        }
        return employee;
    }

    private void ensureNoScheduleConflict(Employee employee, Booking booking) {
        boolean conflict = assignmentRepository.existsConflictingAssignment(
                employee.getId(), BookingEmployeeAssignmentStatus.assigned, BookingStatus.cancelled,
                booking.getBookingDate(), booking.getStartTime(), booking.getEndTime(), booking.getId());
        if (conflict) {
            throw new IllegalArgumentException("Nhân viên '" + employee.getUser().getFullname()
                    + "' đã được phân công trong khung giờ này");
        }
    }
}
