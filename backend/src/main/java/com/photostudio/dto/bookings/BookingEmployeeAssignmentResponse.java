package com.photostudio.dto.bookings;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingEmployeeAssignmentResponse {

    private Long id;
    private Long bookingId;
    private Long employeeId;
    private String employeeName;
    private String employeePhone;
    private String position;
    private LocalDateTime assignedAt;
    private String status;
    private String note;
}
