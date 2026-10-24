package com.photostudio.service;

import com.photostudio.dto.bookings.BookingBackgroundRequest;
import com.photostudio.dto.bookings.BookingBackgroundResponse;

import java.util.List;

public interface BookingBackgroundService {

    List<BookingBackgroundResponse> getBackgroundsByBookingId(Long bookingId);

    BookingBackgroundResponse getById(Long id);

    BookingBackgroundResponse addBackgroundToBooking(BookingBackgroundRequest request);

    BookingBackgroundResponse updateBookingBackground(Long id, BookingBackgroundRequest request);

    void removeBackgroundFromBooking(Long id);
}
