package com.photostudio.mapper;

import com.photostudio.dto.bookings.BookingBackgroundRequest;
import com.photostudio.dto.bookings.BookingBackgroundResponse;
import com.photostudio.model.backgrounds.Background;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingBackground;
import org.springframework.stereotype.Component;

@Component
public class BookingBackgroundMapper {

    public BookingBackground toEntity(BookingBackgroundRequest request, Booking booking, Background background) {
        BookingBackground entity = new BookingBackground();
        entity.setBooking(booking);
        entity.setBackground(background);
        return entity;
    }

    public BookingBackgroundResponse toResponse(BookingBackground entity) {
        Background background = entity.getBackground();
        return new BookingBackgroundResponse(
                entity.getId(),
                entity.getBookingId(),
                background != null ? background.getId() : null,
                background != null ? background.getName() : null,
                background != null ? background.getDescription() : null,
                background != null && background.getStatus() != null ? background.getStatus().name() : null);
    }
}
