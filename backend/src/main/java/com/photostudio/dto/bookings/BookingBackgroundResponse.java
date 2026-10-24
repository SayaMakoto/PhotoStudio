package com.photostudio.dto.bookings;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingBackgroundResponse {

    private Long id;
    private Long bookingId;
    private Long backgroundId;
    private String backgroundName;
    private String description;
    private String status;
}
