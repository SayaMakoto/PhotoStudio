package com.photostudio.dto.bookings;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class BookingServiceResponse {
    private Long id;
    private Long bookingId;
    private Long serviceId;
    private String serviceName;
    private String serviceType;
    private Integer quantity;
    private Double unitPrice;
    private Double subtotal;
}
