package com.photostudio.dto.employees;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {

    private Long id;

    private Long userId;
    private String fullname;
    private String email;
    private String phone;

    private String position;
    private LocalDate hireDate;
    private String status;
}
