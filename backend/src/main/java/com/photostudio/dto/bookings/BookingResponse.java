package com.photostudio.dto.bookings;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;

    private Long customerId;
    // Khi có bảng users, có thể bổ sung thông tin hiển thị:
    // private String customerName;
    // private String customerPhone;

    private Long roomId;
    // Khi có bảng rooms, có thể bổ sung thông tin phòng:
    // private String roomName;

    private LocalDate bookingDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private String status;

    private String customerNote;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
