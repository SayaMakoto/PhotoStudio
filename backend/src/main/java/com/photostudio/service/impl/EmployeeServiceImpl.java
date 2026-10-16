package com.photostudio.service.impl;

import com.photostudio.dto.employees.EmployeeRequest;
import com.photostudio.dto.employees.EmployeeResponse;
import com.photostudio.mapper.EmployeeMapper;
import com.photostudio.model.employees.Employee;
import com.photostudio.model.employees.EmployeePosition;
import com.photostudio.model.employees.EmployeeStatus;
import com.photostudio.model.users.User;
import com.photostudio.repository.EmployeeRepository;
import com.photostudio.repository.UserRepository;
import com.photostudio.service.EmployeeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository, UserRepository userRepository) {
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
    }

    private Employee findEntity(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân viên có id: " + id));
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng có id: " + userId));
    }

    private void ensureUserAvailable(Long userId, Long employeeId) {
        boolean alreadyAssigned = employeeId == null
                ? employeeRepository.existsByUserId(userId)
                : employeeRepository.existsByUserIdAndIdNot(userId, employeeId);
        if (alreadyAssigned) {
            throw new IllegalArgumentException("Người dùng đã có hồ sơ nhân viên!");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> findAll() {
        return employeeRepository.findAll().stream().map(EmployeeMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponse findById(Long id) {
        return EmployeeMapper.toResponse(findEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponse findByUserId(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân viên với userId: " + userId));
        return EmployeeMapper.toResponse(employee);
    }

    @Override
    public EmployeeResponse create(EmployeeRequest request) {
        request.validate();
        ensureUserAvailable(request.getUserId(), null);
        Employee employee = EmployeeMapper.toEntity(request, findUser(request.getUserId()));
        return EmployeeMapper.toResponse(employeeRepository.save(employee));
    }

    @Override
    public EmployeeResponse update(Long id, EmployeeRequest request) {
        request.validate();
        Employee employee = findEntity(id);
        ensureUserAvailable(request.getUserId(), id);
        EmployeeMapper.updateEntity(request, employee, findUser(request.getUserId()));
        return EmployeeMapper.toResponse(employeeRepository.save(employee));
    }

    @Override
    public void delete(Long id) {
        employeeRepository.delete(findEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> findByPosition(String position) {
        EmployeePosition value = parsePosition(position);
        return employeeRepository.findByPosition(value).stream().map(EmployeeMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> findByStatus(String status) {
        EmployeeStatus value = parseStatus(status);
        return employeeRepository.findByStatus(value).stream().map(EmployeeMapper::toResponse).toList();
    }

    private EmployeePosition parsePosition(String position) {
        try {
            return EmployeePosition.valueOf(position.trim().toLowerCase());
        } catch (RuntimeException e) {
            throw new IllegalArgumentException("Vị trí nhân viên không hợp lệ");
        }
    }

    private EmployeeStatus parseStatus(String status) {
        try {
            return EmployeeStatus.valueOf(status.trim().toLowerCase());
        } catch (RuntimeException e) {
            throw new IllegalArgumentException("Trạng thái nhân viên không hợp lệ");
        }
    }
}
