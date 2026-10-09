package com.photostudio.service.impl;

import com.photostudio.dto.bookings.BookingRequest;
import com.photostudio.dto.bookings.BookingResponse;
import com.photostudio.mapper.BookingMapper;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingStatus;
import com.photostudio.repository.BookingRepository;
import com.photostudio.service.BookingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository repository;

    // Khi có UserRepository và RoomRepository, inject thêm vào đây:
    // private final UserRepository userRepository;
    // private final RoomRepository roomRepository;

    public BookingServiceImpl(
            BookingRepository repository
    // UserRepository userRepository,
    // RoomRepository roomRepository
    ) {
        this.repository = repository;
        // this.userRepository = userRepository;
        // this.roomRepository = roomRepository;
    }

    private Booking findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn đặt lịch có id: " + id));
    }

    private void checkRoomConflict(Long roomId, LocalDate bookingDate, LocalTime startTime, LocalTime endTime,
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
        request.validate();

        // Ràng buộc khi có entity User (bảng users):
        // if (!userRepository.existsById(request.getCustomerId())) {
        // throw new IllegalArgumentException("Không tìm thấy khách hàng có id: " +
        // request.getCustomerId());
        // }

        // Ràng buộc khi có entity Room (bảng rooms):
        // if (!roomRepository.existsById(request.getRoomId())) {
        // throw new IllegalArgumentException("Không tìm thấy phòng chụp có id: " +
        // request.getRoomId());
        // }

        // Kiểm tra trùng lịch đặt phòng trong cùng khung giờ
        checkRoomConflict(request.getRoomId(), request.getBookingDate(), request.getStartTime(), request.getEndTime(),
                null);

        Booking booking = BookingMapper.toEntity(request);
        Booking saved = repository.save(booking);
        return BookingMapper.toResponse(saved);
    }

    @Override
    public BookingResponse update(Long id, BookingRequest request) {
        request.validate();

        Booking booking = findEntity(id);

        // Ràng buộc khi có entity User (bảng users):
        // if (!userRepository.existsById(request.getCustomerId())) {
        // throw new IllegalArgumentException("Không tìm thấy khách hàng có id: " +
        // request.getCustomerId());
        // }

        // Ràng buộc khi có entity Room (bảng rooms):
        // if (!roomRepository.existsById(request.getRoomId())) {
        // throw new IllegalArgumentException("Không tìm thấy phòng chụp có id: " +
        // request.getRoomId());
        // }

        // Kiểm tra trùng lịch đặt phòng (trừ đơn hiện tại đang cập nhật)
        checkRoomConflict(request.getRoomId(), request.getBookingDate(), request.getStartTime(), request.getEndTime(),
                id);

        BookingMapper.updateEntity(request, booking);
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

        // Nếu chuyển từ cancelled sang trạng thái khác thì phải kiểm tra lại xung đột
        // phòng
        if (booking.getStatus() == BookingStatus.cancelled && bookingStatus != BookingStatus.cancelled) {
            checkRoomConflict(booking.getRoomId(), booking.getBookingDate(), booking.getStartTime(),
                    booking.getEndTime(), booking.getId());
        }

        booking.setStatus(bookingStatus);
        Booking saved = repository.save(booking);
        return BookingMapper.toResponse(saved);
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
        return repository.findByBookingDate(date)
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
