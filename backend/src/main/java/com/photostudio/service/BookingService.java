package com.photostudio.service;

import com.photostudio.dto.bookings.BookingRequest;
import com.photostudio.dto.bookings.BookingResponse;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {

    List<BookingResponse> findAll();

    BookingResponse findById(Long id);

    BookingResponse create(BookingRequest request);

    BookingResponse update(Long id, BookingRequest request);

    BookingResponse updateStatus(Long id, String status);

    BookingResponse updateAdminDecision(Long id, String status);

    void delete(Long id);

    List<BookingResponse> findByCustomerId(Long customerId);

    List<BookingResponse> findByRoomId(Long roomId);

    List<BookingResponse> findByDate(LocalDate date);

    List<BookingResponse> findByStatus(String status);
}
