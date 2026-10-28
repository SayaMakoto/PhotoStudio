package com.photostudio.service.impl;

import com.photostudio.dto.bookings.BookingBackgroundRequest;
import com.photostudio.dto.bookings.BookingBackgroundResponse;
import com.photostudio.mapper.BookingBackgroundMapper;
import com.photostudio.model.backgrounds.Background;
import com.photostudio.model.backgrounds.BackgroundStatus;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingBackground;
import com.photostudio.model.bookings.BookingStatus;
import com.photostudio.repository.BackgroundRepository;
import com.photostudio.repository.BookingBackgroundRepository;
import com.photostudio.repository.BookingRepository;
import com.photostudio.service.BookingBackgroundService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingBackgroundServiceImpl implements BookingBackgroundService {

    private final BookingBackgroundRepository bookingBackgroundRepository;
    private final BookingRepository bookingRepository;
    private final BackgroundRepository backgroundRepository;
    private final BookingBackgroundMapper bookingBackgroundMapper;

    @Override
    @Transactional(readOnly = true)
    public List<BookingBackgroundResponse> getBackgroundsByBookingId(Long bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new IllegalArgumentException("Không tìm thấy đơn đặt lịch với ID: " + bookingId);
        }
        return bookingBackgroundRepository.findByBookingId(bookingId).stream()
                .map(bookingBackgroundMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingBackgroundResponse getById(Long id) {
        return bookingBackgroundRepository.findById(id)
                .map(bookingBackgroundMapper::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bối cảnh trong booking với ID: " + id));
    }

    @Override
    public BookingBackgroundResponse addBackgroundToBooking(BookingBackgroundRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu yêu cầu không được để trống");
        }
        request.validate();

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy đơn đặt lịch với ID: " + request.getBookingId()));
        if (booking.getStatus() == BookingStatus.cancelled) {
            throw new IllegalArgumentException("Không thể thêm bối cảnh vào đơn đặt lịch đã hủy");
        }

        Background background = backgroundRepository.findById(request.getBackgroundId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy bối cảnh với ID: " + request.getBackgroundId()));
        if (background.getDeletedAt() != null) {
            throw new IllegalArgumentException("Bối cảnh '" + background.getName() + "' đang nằm trong thùng rác");
        }
        if (background.getStatus() != BackgroundStatus.active) {
            throw new IllegalArgumentException("Bối cảnh '" + background.getName() + "' hiện không khả dụng");
        }

        var existing = bookingBackgroundRepository.findByBookingIdAndBackgroundId(
                booking.getId(), background.getId());
        if (existing.isPresent()) {
            return bookingBackgroundMapper.toResponse(existing.get());
        }

        boolean hasConflict = bookingBackgroundRepository.existsConflictingBooking(
                background.getId(), booking.getBookingDate(), booking.getStartTime(), booking.getEndTime(),
                BookingStatus.cancelled, booking.getId());
        if (hasConflict) {
            throw new IllegalArgumentException("Bối cảnh '" + background.getName()
                    + "' đã được đặt trong khung giờ này");
        }

        BookingBackground entity = bookingBackgroundMapper.toEntity(request, booking, background);
        return bookingBackgroundMapper.toResponse(bookingBackgroundRepository.save(entity));
    }

    @Override
    public BookingBackgroundResponse updateBookingBackground(Long id, BookingBackgroundRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu yêu cầu không được để trống");
        }
        request.validate();

        BookingBackground entity = bookingBackgroundRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bối cảnh trong booking với ID: " + id));
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy đơn đặt lịch với ID: " + request.getBookingId()));
        if (booking.getStatus() == BookingStatus.cancelled) {
            throw new IllegalArgumentException("Không thể gán bối cảnh vào đơn đặt lịch đã hủy");
        }

        Background background = backgroundRepository.findById(request.getBackgroundId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy bối cảnh với ID: " + request.getBackgroundId()));
        if (background.getDeletedAt() != null) {
            throw new IllegalArgumentException("Bối cảnh '" + background.getName() + "' đang nằm trong thùng rác");
        }
        if (background.getStatus() != BackgroundStatus.active) {
            throw new IllegalArgumentException("Bối cảnh '" + background.getName() + "' hiện không khả dụng");
        }
        if (bookingBackgroundRepository.existsByBookingIdAndBackgroundIdAndIdNot(
                booking.getId(), background.getId(), id)) {
            throw new IllegalArgumentException("Bối cảnh này đã được thêm vào đơn đặt lịch");
        }

        boolean hasConflict = bookingBackgroundRepository.existsConflictingBooking(
                background.getId(), booking.getBookingDate(), booking.getStartTime(), booking.getEndTime(),
                BookingStatus.cancelled, booking.getId());
        if (hasConflict) {
            throw new IllegalArgumentException("Bối cảnh '" + background.getName()
                    + "' đã được đặt trong khung giờ này");
        }

        entity.setBooking(booking);
        entity.setBackground(background);
        return bookingBackgroundMapper.toResponse(bookingBackgroundRepository.save(entity));
    }

    @Override
    public void removeBackgroundFromBooking(Long id) {
        if (!bookingBackgroundRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy bối cảnh trong booking với ID: " + id);
        }
        bookingBackgroundRepository.deleteById(id);
    }
}
