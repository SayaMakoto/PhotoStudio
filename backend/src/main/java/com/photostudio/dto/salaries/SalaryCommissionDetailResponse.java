package com.photostudio.dto.salaries;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SalaryCommissionDetailResponse {

    private Long id;
    private Long salaryId;
    private Long bookingId;
    private Long packageId;
    private String packageName;
    private Double packagePrice;
    private Double commissionRate;
    private Double commissionAmount;
    private LocalDate shootDate;
    private String customerName;
    private LocalDateTime createdAt;
}
