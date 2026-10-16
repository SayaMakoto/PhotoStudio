package com.photostudio.dto.bookings;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingAccessoryResponse {

    private Long id;
    private Long bookingId;
    private Long accessoryId;
    private String accessoryName;
    private String accessoryType;
    private Integer quantity;
    private Double unitPrice;
    private Double subTotal;
}
