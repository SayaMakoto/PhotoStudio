package com.photostudio.service.impl;

import com.photostudio.dto.bookings.BookingRequest;
import com.photostudio.dto.bookings.BookingResponse;
import com.photostudio.mapper.BookingMapper;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingStatus;
import com.photostudio.model.rooms.Room;
import com.photostudio.model.rooms.RoomStatus;
import com.photostudio.model.users.User;
import com.photostudio.model.users.UserRole;
import com.photostudio.model.users.UserStatus;
import com.photostudio.repository.BookingRepository;
import com.photostudio.repository.BookingEmployeeAssignmentRepository;
import com.photostudio.model.bookings.BookingEmployeeAssignmentStatus;
import com.photostudio.repository.RoomRepository;
import com.photostudio.repository.UserRepository;
import com.photostudio.service.BookingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository repository;
    private final UserRepository userRepository;

    private final RoomRepository roomRepository;
    private final BookingEmployeeAssignmentRepository assignmentRepository;

    public BookingServiceImpl(
            BookingRepository repository,
            UserRepository userRepository,
            RoomRepository roomRepository,
            BookingEmployeeAssignmentRepository assignmentRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.assignmentRepository = assignmentRepository;
    }

    private Booking findEntity(Long id) {
        validateId(id, "Mã đơn đặt lịch");
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn đặt lịch có id: " + id));
    }

    private void validateId(Long id, String fieldName) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException(fieldName + " không hợp lệ");
        }
    }

    private void checkRoomConflict(Long roomId, LocalDateTime bookingDate, LocalTime startTime, LocalTime endTime,
            Long excludeId) {
        boolean hasConflict = repository.existsRoomBookingConflict(
                roomId,
                bookingDate,
                startTime,
                endTime,
                BookingStatus.cancelled,
                excludeId);

        if (hasConflict) {
            throw new IllegalArgumentException(
                    "Phòng chụp (roomId: " + roomId + ") đã có người đặt trong khoảng thời gian từ "
                            + startTime + " đến " + endTime + " ngày " + bookingDate);
        }
    }

    private void validateCustomer(User customer) {
        if (customer.getRole() != UserRole.Customer) {
            throw new IllegalArgumentException("Người dùng có id: " + customer.getId() + " không phải khách hàng");
        }
        if (customer.getStatus() != UserStatus.active) {
            throw new IllegalArgumentException("Tài khoản khách hàng có id: " + customer.getId() + " không hoạt động");
        }
    }

    private void validateRoom(Room room) {
        if (room.getDeletedAt() != null) {
            throw new IllegalArgumentException("Phòng chụp có id: " + room.getId() + " đang nằm trong thùng rác");
        }
        if (room.getStatus() != RoomStatus.active) {
            throw new IllegalArgumentException("Phòng chụp có id: " + room.getId() + " hiện không hoạt động");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(BookingMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse findById(Long id) {
        return BookingMapper.toResponse(findEntity(id));
    }

    @Override
    public BookingResponse create(BookingRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu đơn đặt lịch không được để trống");
        }
        request.validate();

        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy khách hàng có id: " + request.getCustomerId()));
        validateCustomer(customer);

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy phòng chụp có id: " + request.getRoomId()));
        validateRoom(room);

        Booking booking = BookingMapper.toEntity(request, customer, room);
        if (booking.getStatus() != BookingStatus.cancelled) {
            checkRoomConflict(request.getRoomId(), request.getBookingDate(), request.getStartTime(), request.getEndTime(),
                    null);
        }
        Booking saved = repository.save(booking);
        return BookingMapper.toResponse(saved);
    }

    @Override
    public BookingResponse update(Long id, BookingRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu đơn đặt lịch không được để trống");
        }
        request.validate();

        Booking booking = findEntity(id);

        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy khách hàng có id: " + request.getCustomerId()));
        validateCustomer(customer);

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy phòng chụp có id: " + request.getRoomId()));
        validateRoom(room);

        BookingMapper.updateEntity(request, booking, customer, room);
        if (booking.getStatus() != BookingStatus.cancelled) {
            checkRoomConflict(request.getRoomId(), request.getBookingDate(), request.getStartTime(), request.getEndTime(),
                    id);
        }
        Booking saved = repository.save(booking);
        return BookingMapper.toResponse(saved);
    }

    @Override
    public BookingResponse updateStatus(Long id, String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Trạng thái không được để trống");
        }

        BookingStatus bookingStatus;
        try {
            bookingStatus = BookingStatus.valueOf(status.trim().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Trạng thái đặt lịch không hợp lệ. Hợp lệ: pending, confirmed, in_progress, completed, cancelled");
        }

        Booking booking = findEntity(id);

        if (booking.getStatus() == BookingStatus.cancelled && bookingStatus != BookingStatus.cancelled) {
            if (booking.getCustomer() == null) {
                throw new IllegalArgumentException("Đơn đặt lịch chưa được liên kết với khách hàng hợp lệ");
            }
            validateCustomer(booking.getCustomer());
            if (booking.getRoom() == null) {
                throw new IllegalArgumentException("Đơn đặt lịch chưa được liên kết với phòng chụp hợp lệ");
            }
            validateRoom(booking.getRoom());
            checkRoomConflict(booking.getRoom().getId(), booking.getBookingDate(), booking.getStartTime(),
                    booking.getEndTime(), booking.getId());
        }
        if (bookingStatus != BookingStatus.cancelled && booking.getStatus() != BookingStatus.cancelled) {
            if (booking.getRoom() == null) {
                throw new IllegalArgumentException("Đơn đặt lịch chưa được liên kết với phòng chụp hợp lệ");
            }
            checkRoomConflict(booking.getRoom().getId(), booking.getBookingDate(), booking.getStartTime(),
                    booking.getEndTime(), booking.getId());
        }

        booking.setStatus(bookingStatus);
        if (bookingStatus == BookingStatus.completed || bookingStatus == BookingStatus.cancelled) {
            BookingEmployeeAssignmentStatus assignmentStatus = bookingStatus == BookingStatus.completed
                    ? BookingEmployeeAssignmentStatus.completed : BookingEmployeeAssignmentStatus.cancelled;
            assignmentRepository.releaseAssignedEmployees(booking.getId(),
                    BookingEmployeeAssignmentStatus.assigned, assignmentStatus);
        }
        Booking saved = repository.save(booking);
        return BookingMapper.toResponse(saved);
    }

    @Override
    public BookingResponse updateAdminDecision(Long id, String status) {
        Booking booking = findEntity(id);
        if (booking.getStatus() != BookingStatus.pending) {
            throw new IllegalArgumentException("Admin chỉ được quyết định đơn đang ở trạng thái chờ xác nhận.");
        }
        if (!"confirmed".equalsIgnoreCase(status) && !"cancelled".equalsIgnoreCase(status)) {
            throw new IllegalArgumentException("Admin chỉ có thể xác nhận hoặc từ chối đơn đặt lịch.");
        }
        return updateStatus(id, status);
    }

    @Override
    public void delete(Long id) {
        Booking booking = findEntity(id);
        repository.delete(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> findByCustomerId(Long customerId) {
        if (customerId == null || customerId <= 0) {
            throw new IllegalArgumentException("Mã khách hàng không hợp lệ");
        }
        return repository.findByCustomerId(customerId)
                .stream()
                .map(BookingMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> findByRoomId(Long roomId) {
        if (roomId == null || roomId <= 0) {
            throw new IllegalArgumentException("Mã phòng chụp không hợp lệ");
        }
        return repository.findByRoomId(roomId)
                .stream()
                .map(BookingMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> findByDate(LocalDate date) {
        if (date == null) {
            throw new IllegalArgumentException("Ngày tìm kiếm không được để trống");
        }
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        return repository.findByBookingDateBetween(startOfDay, endOfDay)
                .stream()
                .map(BookingMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> findByStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Trạng thái tìm kiếm không được để trống");
        }

        BookingStatus bookingStatus;
        try {
            bookingStatus = BookingStatus.valueOf(status.trim().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Trạng thái đặt lịch không hợp lệ. Hợp lệ: pending, confirmed, in_progress, completed, cancelled");
        }

        return repository.findByStatus(bookingStatus)
                .stream()
                .map(BookingMapper::toResponse)
                .toList();
    }
}
