package com.photostudio.service;

import com.photostudio.dto.bookings.BookingClothingRequest;
import com.photostudio.dto.bookings.BookingClothingResponse;

import java.util.List;

public interface BookingClothingService {

    List<BookingClothingResponse> getClothesByBookingId(Long bookingId);

    BookingClothingResponse getById(Long id);

    BookingClothingResponse addClothToBooking(BookingClothingRequest request);

    BookingClothingResponse updateBookingClothing(Long id, BookingClothingRequest request);

    void removeClothFromBooking(Long id);

    Double calculateTotalClothingPrice(Long bookingId);
}
