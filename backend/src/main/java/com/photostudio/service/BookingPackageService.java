package com.photostudio.service;

import com.photostudio.dto.bookings.BookingPackageRequest;
import com.photostudio.dto.bookings.BookingPackageResponse;

import java.util.List;

public interface BookingPackageService {

    List<BookingPackageResponse> getPackagesByBookingId(Long bookingId);

    BookingPackageResponse getById(Long id);

    BookingPackageResponse addPackageToBooking(BookingPackageRequest request);

    BookingPackageResponse updateBookingPackage(Long id, Integer quantity, Double unitPrice);

    void removePackageFromBooking(Long id);

    Double calculateTotalPackagePrice(Long bookingId);
}
