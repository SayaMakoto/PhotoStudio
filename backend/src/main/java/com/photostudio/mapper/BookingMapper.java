package com.photostudio.mapper;

import com.photostudio.dto.bookings.BookingRequest;
import com.photostudio.dto.bookings.BookingResponse;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingStatus;

public class BookingMapper {

    public static Booking toEntity(BookingRequest request) {
        Booking booking = new Booking();
        booking.setCustomerId(request.getCustomerId());
        booking.setRoomId(request.getRoomId());
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setCustomerNote(request.getCustomerNote());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            booking.setStatus(BookingStatus.valueOf(request.getStatus().trim().toLowerCase()));
        } else {
            booking.setStatus(BookingStatus.pending);
        }

        return booking;
    }

    public static void updateEntity(BookingRequest request, Booking booking) {
        booking.setCustomerId(request.getCustomerId());
        booking.setRoomId(request.getRoomId());
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setCustomerNote(request.getCustomerNote());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            booking.setStatus(BookingStatus.valueOf(request.getStatus().trim().toLowerCase()));
        }
    }

    public static BookingResponse toResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getCustomerId(),
                // Khi có bảng users, map thông tin khách: booking.getCustomer() != null ? booking.getCustomer().getFullname() : null,
                // Khi có bảng users: booking.getCustomer() != null ? booking.getCustomer().getPhone() : null,
                booking.getRoomId(),
                // Khi có bảng rooms, map tên phòng: booking.getRoom() != null ? booking.getRoom().getName() : null,
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getStatus() != null ? booking.getStatus().name() : null,
                booking.getCustomerNote(),
                booking.getCreatedAt(),
                booking.getUpdatedAt()
        );
    }
}
