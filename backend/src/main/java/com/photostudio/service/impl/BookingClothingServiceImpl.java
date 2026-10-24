package com.photostudio.service.impl;

import com.photostudio.dto.bookings.BookingClothingRequest;
import com.photostudio.dto.bookings.BookingClothingResponse;
import com.photostudio.mapper.BookingClothingMapper;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingClothing;
import com.photostudio.model.bookings.BookingStatus;
import com.photostudio.model.clothes.Cloth;
import com.photostudio.model.clothes.ClothStatus;
import com.photostudio.repository.BookingClothingRepository;
import com.photostudio.repository.BookingRepository;
import com.photostudio.repository.ClothRepository;
import com.photostudio.service.BookingClothingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingClothingServiceImpl implements BookingClothingService {

    private final BookingClothingRepository bookingClothingRepository;
    private final BookingRepository bookingRepository;
    private final ClothRepository clothRepository;
    private final BookingClothingMapper bookingClothingMapper;

    @Override
    @Transactional(readOnly = true)
    public List<BookingClothingResponse> getClothesByBookingId(Long bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new IllegalArgumentException("Không tìm thấy đơn đặt lịch với ID: " + bookingId);
        }
        return bookingClothingRepository.findByBookingId(bookingId).stream()
                .map(bookingClothingMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingClothingResponse getById(Long id) {
        return bookingClothingRepository.findById(id)
                .map(bookingClothingMapper::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy trang phục trong booking với ID: " + id));
    }

    @Override
    public BookingClothingResponse addClothToBooking(BookingClothingRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu yêu cầu không được để trống");
        }
        request.validate();

        Booking booking = findActiveBooking(request.getBookingId());
        Cloth cloth = findAvailableCloth(request.getClothId());
        int quantity = request.getQuantity() != null ? request.getQuantity() : 1;

        BookingClothing item = bookingClothingRepository
                .findByBookingIdAndClothId(booking.getId(), cloth.getId())
                .orElseGet(() -> bookingClothingMapper.toEntity(request, booking, cloth));
        if (item.getId() != null) {
            item.setQuantity(item.getQuantity() + quantity);
        }

        ensureNoScheduleConflict(cloth, booking);
        return bookingClothingMapper.toResponse(bookingClothingRepository.save(item));
    }

    @Override
    public BookingClothingResponse updateBookingClothing(Long id, BookingClothingRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu yêu cầu không được để trống");
        }
        request.validate();

        BookingClothing item = bookingClothingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy trang phục trong booking với ID: " + id));
        Booking booking = findActiveBooking(request.getBookingId());
        Cloth cloth = findAvailableCloth(request.getClothId());
        if (bookingClothingRepository.existsByBookingIdAndClothIdAndIdNot(booking.getId(), cloth.getId(), id)) {
            throw new IllegalArgumentException("Trang phục này đã được thêm vào đơn đặt lịch");
        }

        ensureNoScheduleConflict(cloth, booking);
        item.setBooking(booking);
        item.setCloth(cloth);
        item.setQuantity(request.getQuantity() != null ? request.getQuantity() : item.getQuantity());
        return bookingClothingMapper.toResponse(bookingClothingRepository.save(item));
    }

    @Override
    public void removeClothFromBooking(Long id) {
        if (!bookingClothingRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy trang phục trong booking với ID: " + id);
        }
        bookingClothingRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Double calculateTotalClothingPrice(Long bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new IllegalArgumentException("Không tìm thấy đơn đặt lịch với ID: " + bookingId);
        }
        return bookingClothingRepository.findByBookingId(bookingId).stream()
                .mapToDouble(item -> {
                    Double price = item.getCloth().getPrice();
                    Integer quantity = item.getQuantity();
                    return (price != null ? price : 0.0) * (quantity != null ? quantity : 0);
                })
                .sum();
    }

    private Booking findActiveBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn đặt lịch với ID: " + bookingId));
        if (booking.getStatus() == BookingStatus.cancelled) {
            throw new IllegalArgumentException("Không thể thêm trang phục vào đơn đặt lịch đã hủy");
        }
        return booking;
    }

    private Cloth findAvailableCloth(Long clothId) {
        Cloth cloth = clothRepository.findById(clothId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy trang phục với ID: " + clothId));
        if (cloth.getStatus() != ClothStatus.available) {
            throw new IllegalArgumentException("Trang phục '" + cloth.getName() + "' hiện không khả dụng");
        }
        return cloth;
    }

    private void ensureNoScheduleConflict(Cloth cloth, Booking booking) {
        boolean hasConflict = bookingClothingRepository.existsConflictingBooking(
                cloth.getId(), booking.getBookingDate(), booking.getStartTime(), booking.getEndTime(),
                BookingStatus.cancelled, booking.getId());
        if (hasConflict) {
            throw new IllegalArgumentException("Trang phục '" + cloth.getName()
                    + "' đã được đặt trong khung giờ này");
        }
    }
}
