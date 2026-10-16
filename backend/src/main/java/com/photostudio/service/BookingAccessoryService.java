package com.photostudio.service;

import com.photostudio.dto.bookings.BookingAccessoryRequest;
import com.photostudio.dto.bookings.BookingAccessoryResponse;

import java.util.List;

public interface BookingAccessoryService {

    List<BookingAccessoryResponse> getAccessoriesByBookingId(Long bookingId);

    BookingAccessoryResponse getById(Long id);

    BookingAccessoryResponse addAccessoryToBooking(BookingAccessoryRequest request);

    BookingAccessoryResponse updateBookingAccessory(Long id, Integer quantity);

    void removeAccessoryFromBooking(Long id);

    Double calculateTotalAccessoryPrice(Long bookingId);
}
