package com.photostudio.dto.bookings;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingPackageResponse {

    private Long id;
    private Long bookingId;
    private Long packageId;
    private String packageName;
    private Integer duration;
    private Integer quantity;
    private Double unitPrice;
    private Double subTotal;
}
