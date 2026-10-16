package com.photostudio.mapper;

import com.photostudio.dto.employees.EmployeeRequest;
import com.photostudio.dto.employees.EmployeeResponse;
import com.photostudio.model.employees.Employee;
import com.photostudio.model.employees.EmployeePosition;
import com.photostudio.model.employees.EmployeeStatus;
import com.photostudio.model.users.User;

public class EmployeeMapper {

    public static Employee toEntity(EmployeeRequest request, User user) {
        Employee employee = new Employee();
        employee.setUser(user);
        employee.setPosition(EmployeePosition.valueOf(request.getPosition().trim().toLowerCase()));
        employee.setHireDate(request.getHireDate());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            employee.setStatus(EmployeeStatus.valueOf(request.getStatus().trim().toLowerCase()));
        } else {
            employee.setStatus(EmployeeStatus.active);
        }

        return employee;
    }

    public static void updateEntity(EmployeeRequest request, Employee employee, User user) {
        employee.setUser(user);
        employee.setPosition(EmployeePosition.valueOf(request.getPosition().trim().toLowerCase()));
        employee.setHireDate(request.getHireDate());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            employee.setStatus(EmployeeStatus.valueOf(request.getStatus().trim().toLowerCase()));
        }
    }

    public static EmployeeResponse toResponse(Employee employee) {
        User user = employee.getUser();
        return new EmployeeResponse(
                employee.getId(),
                user != null ? user.getId() : null,
                user != null ? user.getFullname() : null,
                user != null ? user.getEmail() : null,
                user != null ? user.getPhone() : null,
                employee.getPosition() != null ? employee.getPosition().name() : null,
                employee.getHireDate(),
                employee.getStatus() != null ? employee.getStatus().name() : null
        );
    }
}
