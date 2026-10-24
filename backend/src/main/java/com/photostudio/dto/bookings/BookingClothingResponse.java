package com.photostudio.dto.bookings;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingClothingResponse {

    private Long id;
    private Long bookingId;
    private Long clothId;
    private String clothName;
    private String type;
    private String size;
    private String gender;
    private String color;
    private Integer quantity;
    private Double unitPrice;
    private Double subTotal;
}
