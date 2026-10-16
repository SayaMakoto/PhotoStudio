package com.photostudio.service.impl;

import com.photostudio.dto.bookings.BookingAccessoryRequest;
import com.photostudio.dto.bookings.BookingAccessoryResponse;
import com.photostudio.mapper.BookingAccessoryMapper;
import com.photostudio.model.accessories.Accessory;
import com.photostudio.model.accessories.AccessoryStatus;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingAccessory;
import com.photostudio.model.bookings.BookingStatus;
import com.photostudio.repository.AccessoryRepository;
import com.photostudio.repository.BookingAccessoryRepository;
import com.photostudio.repository.BookingRepository;
import com.photostudio.service.BookingAccessoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingAccessoryServiceImpl implements BookingAccessoryService {

    private final BookingAccessoryRepository bookingAccessoryRepository;
    private final BookingRepository bookingRepository;
    private final AccessoryRepository accessoryRepository;
    private final BookingAccessoryMapper bookingAccessoryMapper;

    @Override
    @Transactional(readOnly = true)
    public List<BookingAccessoryResponse> getAccessoriesByBookingId(Long bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new IllegalArgumentException("Không tìm thấy đơn đặt lịch với ID: " + bookingId);
        }
        return bookingAccessoryRepository.findByBookingId(bookingId).stream()
                .map(bookingAccessoryMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingAccessoryResponse getById(Long id) {
        return bookingAccessoryRepository.findById(id)
                .map(bookingAccessoryMapper::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phụ kiện trong booking với ID: " + id));
    }

    @Override
    public BookingAccessoryResponse addAccessoryToBooking(BookingAccessoryRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu yêu cầu không được để trống");
        }
        request.validate();

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy đơn đặt lịch với ID: " + request.getBookingId()));
        if (booking.getStatus() == BookingStatus.cancelled) {
            throw new IllegalArgumentException("Không thể thêm phụ kiện vào đơn đặt lịch đã hủy");
        }

        Accessory accessory = accessoryRepository.findById(request.getAccessoryId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy phụ kiện với ID: " + request.getAccessoryId()));
        if (accessory.getStatus() != AccessoryStatus.available) {
            throw new IllegalArgumentException("Phụ kiện '" + accessory.getName() + "' hiện không khả dụng");
        }

        int quantity = request.getQuantity() != null ? request.getQuantity() : 1;
        BookingAccessory bookingAccessory = bookingAccessoryRepository
                .findByBookingIdAndAccessoryId(booking.getId(), accessory.getId())
                .orElseGet(() -> bookingAccessoryMapper.toEntity(request, booking, accessory));
        long reservedQuantity = reservedQuantity(accessory, booking, null);
        int stockQuantity = accessory.getQuantity() != null ? accessory.getQuantity() : 0;
        if (reservedQuantity + quantity > stockQuantity) {
            throw new IllegalArgumentException("Số lượng phụ kiện '" + accessory.getName()
                    + "' vượt quá số lượng còn khả dụng trong khung giờ đặt lịch");
        }
        if (bookingAccessory.getId() != null) {
            bookingAccessory.setQuantity(bookingAccessory.getQuantity() + quantity);
        }

        return bookingAccessoryMapper.toResponse(bookingAccessoryRepository.save(bookingAccessory));
    }

    @Override
    public BookingAccessoryResponse updateBookingAccessory(Long id, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Số lượng phụ kiện phải lớn hơn 0");
        }
        BookingAccessory bookingAccessory = bookingAccessoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phụ kiện trong booking với ID: " + id));
        long reservedByOtherBookings = reservedQuantity(
                bookingAccessory.getAccessory(), bookingAccessory.getBooking(), id);
        int stockQuantity = bookingAccessory.getAccessory().getQuantity() != null
                ? bookingAccessory.getAccessory().getQuantity() : 0;
        if (reservedByOtherBookings + quantity > stockQuantity) {
            throw new IllegalArgumentException("Số lượng phụ kiện vượt quá số lượng còn khả dụng trong khung giờ đặt lịch");
        }
        bookingAccessory.setQuantity(quantity);
        return bookingAccessoryMapper.toResponse(bookingAccessoryRepository.save(bookingAccessory));
    }

    @Override
    public void removeAccessoryFromBooking(Long id) {
        if (!bookingAccessoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy phụ kiện trong booking với ID: " + id);
        }
        bookingAccessoryRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Double calculateTotalAccessoryPrice(Long bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new IllegalArgumentException("Không tìm thấy đơn đặt lịch với ID: " + bookingId);
        }
        return bookingAccessoryRepository.findByBookingId(bookingId).stream()
                .mapToDouble(item -> {
                    Double price = item.getAccessory().getPrice();
                    Integer quantity = item.getQuantity();
                    return (price != null ? price : 0.0) * (quantity != null ? quantity : 0);
                })
                .sum();
    }

    private long reservedQuantity(Accessory accessory, Booking booking, Long excludeId) {
        Long reserved = bookingAccessoryRepository.sumReservedQuantityForOverlappingBookings(
                accessory.getId(), booking.getBookingDate(), booking.getStartTime(), booking.getEndTime(),
                BookingStatus.cancelled, excludeId);
        return reserved != null ? reserved : 0L;
    }
}
