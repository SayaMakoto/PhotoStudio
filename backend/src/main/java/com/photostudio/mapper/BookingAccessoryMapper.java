package com.photostudio.mapper;

import com.photostudio.dto.bookings.BookingAccessoryRequest;
import com.photostudio.dto.bookings.BookingAccessoryResponse;
import com.photostudio.model.accessories.Accessory;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingAccessory;
import org.springframework.stereotype.Component;

@Component
public class BookingAccessoryMapper {

    public BookingAccessory toEntity(BookingAccessoryRequest request, Booking booking, Accessory accessory) {
        BookingAccessory entity = new BookingAccessory();
        entity.setBooking(booking);
        entity.setAccessory(accessory);
        entity.setQuantity(request.getQuantity() != null ? request.getQuantity() : 1);
        return entity;
    }

    public BookingAccessoryResponse toResponse(BookingAccessory entity) {
        Accessory accessory = entity.getAccessory();
        double unitPrice = accessory != null && accessory.getPrice() != null ? accessory.getPrice() : 0.0;
        int quantity = entity.getQuantity() != null ? entity.getQuantity() : 0;

        return new BookingAccessoryResponse(
                entity.getId(),
                entity.getBookingId(),
                accessory != null ? accessory.getId() : null,
                accessory != null ? accessory.getName() : null,
                accessory != null && accessory.getType() != null ? accessory.getType().name() : null,
                entity.getQuantity(),
                unitPrice,
                unitPrice * quantity);
    }
}
