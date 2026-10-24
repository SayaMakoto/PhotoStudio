package com.photostudio.service.impl;

import com.photostudio.dto.bookings.BookingServiceRequest;
import com.photostudio.dto.bookings.BookingServiceResponse;
import com.photostudio.mapper.BookingServiceMapper;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingService;
import com.photostudio.model.bookings.BookingStatus;
import com.photostudio.model.services.ServiceStatus;
import com.photostudio.model.services.StudioService;
import com.photostudio.repository.BookingRepository;
import com.photostudio.repository.BookingServiceRepository;
import com.photostudio.repository.ServiceRepository;
import com.photostudio.service.BookingServiceItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingServiceItemServiceImpl implements BookingServiceItemService {
    private final BookingServiceRepository repository;
    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;
    private final BookingServiceMapper mapper;

    @Override @Transactional(readOnly = true)
    public List<BookingServiceResponse> getServicesByBookingId(Long bookingId) {
        validateId(bookingId, "Mã đơn đặt lịch");
        if (!bookingRepository.existsById(bookingId)) throw new IllegalArgumentException("Không tìm thấy đơn đặt lịch với ID: " + bookingId);
        return repository.findByBookingId(bookingId).stream().map(mapper::toResponse).toList();
    }

    @Override @Transactional(readOnly = true)
    public BookingServiceResponse getById(Long id) {
        validateId(id, "Mã dịch vụ trong booking");
        return repository.findById(id).map(mapper::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy dịch vụ trong booking với ID: " + id));
    }

    @Override
    public BookingServiceResponse addServiceToBooking(BookingServiceRequest request) {
        if (request == null) throw new IllegalArgumentException("Dữ liệu yêu cầu không được để trống");
        request.validate();
        Booking booking = findBooking(request.getBookingId());
        StudioService service = findActiveService(request.getServiceId());
        var existing = repository.findByBookingIdAndServiceId(booking.getId(), service.getId());
        if (existing.isPresent()) {
            BookingService entity = existing.get();
            entity.setQuantity(entity.getQuantity() + (request.getQuantity() != null ? request.getQuantity() : 1));
            if (request.getUnitPrice() != null) entity.setUnitPrice(request.getUnitPrice());
            return mapper.toResponse(repository.save(entity));
        }
        BookingService entity = new BookingService();
        entity.setBooking(booking);
        entity.setService(service);
        entity.setQuantity(request.getQuantity() != null ? request.getQuantity() : 1);
        entity.setUnitPrice(request.getUnitPrice() != null ? request.getUnitPrice() : service.getPrice());
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    public BookingServiceResponse updateBookingService(Long id, BookingServiceRequest request) {
        validateId(id, "Mã dịch vụ trong booking");
        if (request == null) throw new IllegalArgumentException("Dữ liệu yêu cầu không được để trống");
        request.validate();
        BookingService entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy dịch vụ trong booking với ID: " + id));
        Booking booking = findBooking(request.getBookingId());
        StudioService service = findActiveService(request.getServiceId());
        if (repository.existsByBookingIdAndServiceIdAndIdNot(booking.getId(), service.getId(), id))
            throw new IllegalArgumentException("Dịch vụ này đã có trong đơn đặt lịch");
        entity.setBooking(booking);
        entity.setService(service);
        if (request.getQuantity() != null) entity.setQuantity(request.getQuantity());
        if (request.getUnitPrice() != null) entity.setUnitPrice(request.getUnitPrice());
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    public void removeServiceFromBooking(Long id) {
        validateId(id, "Mã dịch vụ trong booking");
        if (!repository.existsById(id)) throw new IllegalArgumentException("Không tìm thấy dịch vụ trong booking với ID: " + id);
        repository.deleteById(id);
    }

    @Override @Transactional(readOnly = true)
    public Double calculateTotalServicePrice(Long bookingId) {
        return getServicesByBookingId(bookingId).stream().mapToDouble(BookingServiceResponse::getSubtotal).sum();
    }

    private Booking findBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn đặt lịch với ID: " + id));
        if (booking.getStatus() == BookingStatus.cancelled || booking.getStatus() == BookingStatus.completed)
            throw new IllegalArgumentException("Không thể thêm hoặc sửa dịch vụ cho đơn đã hủy hoặc hoàn thành");
        return booking;
    }

    private StudioService findActiveService(Long id) {
        StudioService service = serviceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy dịch vụ với ID: " + id));
        if (service.getStatus() != ServiceStatus.active)
            throw new IllegalArgumentException("Dịch vụ '" + service.getName() + "' hiện không hoạt động");
        return service;
    }

    private void validateId(Long id, String field) {
        if (id == null || id <= 0) throw new IllegalArgumentException(field + " không hợp lệ");
    }
}
