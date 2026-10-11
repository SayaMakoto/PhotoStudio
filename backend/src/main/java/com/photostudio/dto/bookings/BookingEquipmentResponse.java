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
public class BookingEquipmentResponse {

    private Long id;
    private Long bookingId;
    private Long equipmentId;
    private String equipmentName;
    private String equipmentType;
    private String equipmentSerialNumber;
    private LocalDateTime assignedAt;
    private LocalDateTime returnedAt;
    private String status;
    private String note;
}
