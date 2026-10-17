package com.photostudio.dto.bookings;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;

    private Long customerId;
    private String customerName;
    private String customerPhone;

    private Long roomId;
    private String roomName;

    private LocalDateTime bookingDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private String status;

    private String customerNote;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
