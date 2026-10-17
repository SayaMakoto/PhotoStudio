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

    private final EmployeeRepository repository;
    private final UserRepository userRepository;

    public EmployeeServiceImpl(EmployeeRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    private Employee findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân viên có id: " + id));
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng có id: " + userId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> findAll() {
        return repository.findAll().stream().map(EmployeeMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponse findById(Long id) {
        return EmployeeMapper.toResponse(findEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponse findByUserId(Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Mã người dùng không hợp lệ");
        }
        Employee employee = repository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy nhân viên có userId: " + userId));
        return EmployeeMapper.toResponse(employee);
    }

    @Override
    public EmployeeResponse create(EmployeeRequest request) {
        request.validate();

        User user = findUser(request.getUserId());

        // Quan hệ 1-1: một user chỉ có tối đa một hồ sơ nhân viên
        if (repository.existsByUserId(request.getUserId())) {
            throw new IllegalArgumentException(
                    "Người dùng có id " + request.getUserId() + " đã có hồ sơ nhân viên");
        }

        Employee saved = repository.save(EmployeeMapper.toEntity(request, user));
        return EmployeeMapper.toResponse(saved);
    }

    @Override
    public EmployeeResponse update(Long id, EmployeeRequest request) {
        request.validate();

        Employee employee = findEntity(id);
        User user = findUser(request.getUserId());

        if (repository.existsByUserIdAndIdNot(request.getUserId(), id)) {
            throw new IllegalArgumentException(
                    "Người dùng có id " + request.getUserId() + " đã có hồ sơ nhân viên khác");
        }

        EmployeeMapper.updateEntity(request, employee, user);
        return EmployeeMapper.toResponse(repository.save(employee));
    }

    @Override
    public void delete(Long id) {
        repository.delete(findEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> findByPosition(String position) {
        if (position == null || position.isBlank()) {
            throw new IllegalArgumentException("Vị trí nhân viên không được để trống");
        }
        EmployeePosition employeePosition;
        try {
            employeePosition = EmployeePosition.valueOf(position.trim().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Vị trí nhân viên không hợp lệ. Các vị trí hợp lệ: photographer, makeup, logistics");
        }
        return repository.findByPosition(employeePosition).stream()
                .map(EmployeeMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> findByStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Trạng thái không được để trống");
        }
        EmployeeStatus employeeStatus;
        try {
            employeeStatus = EmployeeStatus.valueOf(status.trim().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Trạng thái nhân viên không hợp lệ. Các trạng thái hợp lệ: active, inactive, on_leave");
        }
        return repository.findByStatus(employeeStatus).stream()
                .map(EmployeeMapper::toResponse).toList();
    }
}
