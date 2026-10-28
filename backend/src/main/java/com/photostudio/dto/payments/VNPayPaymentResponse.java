package com.photostudio.dto.payments;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VNPayPaymentResponse {

    private String paymentUrl;
    private String txnRef;
    private Double amount;
    private String message;
}
