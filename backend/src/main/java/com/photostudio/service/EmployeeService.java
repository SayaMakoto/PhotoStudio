package com.photostudio.service;

import com.photostudio.dto.employees.EmployeeRequest;
import com.photostudio.dto.employees.EmployeeResponse;

import java.util.List;

public interface EmployeeService {

    List<EmployeeResponse> findAll();

    EmployeeResponse findById(Long id);

    EmployeeResponse findByUserId(Long userId);

    EmployeeResponse create(EmployeeRequest request);

    EmployeeResponse update(Long id, EmployeeRequest request);

    void delete(Long id);

    List<EmployeeResponse> findByPosition(String position);

    List<EmployeeResponse> findByStatus(String status);
}
