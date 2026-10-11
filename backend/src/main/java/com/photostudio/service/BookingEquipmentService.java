package com.photostudio.service;

import com.photostudio.dto.bookings.BookingEquipmentRequest;
import com.photostudio.dto.bookings.BookingEquipmentResponse;

import java.util.List;

public interface BookingEquipmentService {

    List<BookingEquipmentResponse> getEquipmentsByBookingId(Long bookingId);

    BookingEquipmentResponse getById(Long id);

    BookingEquipmentResponse assignEquipmentToBooking(BookingEquipmentRequest request);

    BookingEquipmentResponse returnEquipment(Long id, String note);

    BookingEquipmentResponse updateAssignmentStatus(Long id, String status, String note);

    void removeEquipmentFromBooking(Long id);
}
