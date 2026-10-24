package com.photostudio.service;

import com.photostudio.dto.bookings.BookingServiceRequest;
import com.photostudio.dto.bookings.BookingServiceResponse;
import java.util.List;

public interface BookingServiceItemService {
    List<BookingServiceResponse> getServicesByBookingId(Long bookingId);
    BookingServiceResponse getById(Long id);
    BookingServiceResponse addServiceToBooking(BookingServiceRequest request);
    BookingServiceResponse updateBookingService(Long id, BookingServiceRequest request);
    void removeServiceFromBooking(Long id);
    Double calculateTotalServicePrice(Long bookingId);
}
