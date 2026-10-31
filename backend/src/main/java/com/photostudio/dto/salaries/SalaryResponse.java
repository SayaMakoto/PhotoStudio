package com.photostudio.dto.salaries;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SalaryResponse {

    private Long id;
    private Long employeeId;
    private Long userId;
    private String employeeName;
    private String employeePhone;
    private String employeeEmail;
    private String position;
    private Integer month;
    private Integer year;
    private Integer workDays;
    private Double dailyRate;
    private Double baseSalary;
    private Integer totalShoots;
    private Double commissionRate;
    private Double totalCommission;
    private Double bonus;
    private Double deduction;
    private Double netSalary;
    private String status;
    private String note;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<SalaryCommissionDetailResponse> commissionDetails;
}
