package com.photostudio.mapper;

import com.photostudio.dto.bookings.BookingServiceResponse;
import com.photostudio.model.bookings.BookingService;
import org.springframework.stereotype.Component;

@Component
public class BookingServiceMapper {
    public BookingServiceResponse toResponse(BookingService entity) {
        var service = entity.getService();
        int quantity = entity.getQuantity() != null ? entity.getQuantity() : 0;
        double price = entity.getUnitPrice() != null ? entity.getUnitPrice() : 0.0;
        return new BookingServiceResponse(entity.getId(), entity.getBookingId(), entity.getServiceId(),
                service != null ? service.getName() : null,
                service != null && service.getType() != null ? service.getType().name() : null,
                entity.getQuantity(), entity.getUnitPrice(), price * quantity);
    }
}
