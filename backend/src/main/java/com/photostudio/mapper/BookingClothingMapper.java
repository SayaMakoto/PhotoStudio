package com.photostudio.mapper;

import com.photostudio.dto.bookings.BookingClothingRequest;
import com.photostudio.dto.bookings.BookingClothingResponse;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingClothing;
import com.photostudio.model.clothes.Cloth;
import org.springframework.stereotype.Component;

@Component
public class BookingClothingMapper {

    public BookingClothing toEntity(BookingClothingRequest request, Booking booking, Cloth cloth) {
        BookingClothing entity = new BookingClothing();
        entity.setBooking(booking);
        entity.setCloth(cloth);
        entity.setQuantity(request.getQuantity() != null ? request.getQuantity() : 1);
        return entity;
    }

    public BookingClothingResponse toResponse(BookingClothing entity) {
        Cloth cloth = entity.getCloth();
        double unitPrice = cloth != null && cloth.getPrice() != null ? cloth.getPrice() : 0.0;
        int quantity = entity.getQuantity() != null ? entity.getQuantity() : 0;

        return new BookingClothingResponse(
                entity.getId(),
                entity.getBookingId(),
                cloth != null ? cloth.getId() : null,
                cloth != null ? cloth.getName() : null,
                cloth != null && cloth.getType() != null ? cloth.getType().name() : null,
                cloth != null ? cloth.getSize() : null,
                cloth != null && cloth.getGender() != null ? cloth.getGender().name() : null,
                cloth != null ? cloth.getColor() : null,
                entity.getQuantity(),
                unitPrice,
                unitPrice * quantity);
    }
}
