package com.photostudio.dto.payments;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VNPayPaymentRequest {

    private Long bookingId;
    private Double amount;
    private String paymentType; // "deposit" | "full"
    private String note;
    private String bankCode; // optional: NCB, etc.
    private String returnUrl;
}
