package com.photostudio.service;

import com.photostudio.dto.salaries.SalaryResponse;

import java.util.List;
import java.util.Map;

public interface SalaryService {

    List<SalaryResponse> findAll(Integer month, Integer year);

    SalaryResponse findById(Long id);

    List<SalaryResponse> findByEmployeeId(Long employeeId);

    List<SalaryResponse> findByUserId(Long userId);

    List<SalaryResponse> calculateMonthlySalaries(Integer month, Integer year);

    SalaryResponse updateStatus(Long id, Map<String, Object> payload);

    void delete(Long id);
}
