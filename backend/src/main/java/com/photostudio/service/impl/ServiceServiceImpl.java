package com.photostudio.service.impl;

import com.photostudio.dto.services.ServiceRequest;
import com.photostudio.dto.services.ServiceResponse;
import com.photostudio.mapper.ServiceMapper;
import com.photostudio.model.services.ServiceStatus;
import com.photostudio.model.services.ServiceType;
import com.photostudio.model.services.StudioService;
import com.photostudio.repository.ServiceRepository;
import com.photostudio.service.ServiceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ServiceServiceImpl implements ServiceService {

    private final ServiceRepository repository;

    public ServiceServiceImpl(ServiceRepository repository) {
        this.repository = repository;
    }

    private StudioService findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy dịch vụ có id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceResponse> findAll() {
        return repository.findAll().stream().map(ServiceMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceResponse findById(Long id) {
        return ServiceMapper.toResponse(findEntity(id));
    }

    @Override
    public ServiceResponse create(ServiceRequest request) {
        request.validate();
        StudioService saved = repository.save(ServiceMapper.toEntity(request));
        return ServiceMapper.toResponse(saved);
    }

    @Override
    public ServiceResponse update(Long id, ServiceRequest request) {
        request.validate();
        StudioService service = findEntity(id);
        ServiceMapper.updateEntity(request, service);
        return ServiceMapper.toResponse(repository.save(service));
    }

    @Override
    public void delete(Long id) {
        repository.delete(findEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceResponse> findByName(String name) {
        return repository.findByNameContainingIgnoreCase(name).stream()
                .map(ServiceMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceResponse> findByType(String type) {
        if (type == null || type.isBlank()) {
            throw new IllegalArgumentException("Loại dịch vụ không được để trống");
        }
        ServiceType serviceType;
        try {
            serviceType = ServiceType.valueOf(type.trim().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Loại dịch vụ không hợp lệ. Các loại hợp lệ: photography, makeup, clothing, accessory, background");
        }
        return repository.findByType(serviceType).stream().map(ServiceMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceResponse> findByStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Trạng thái không được để trống");
        }
        ServiceStatus serviceStatus;
        try {
            serviceStatus = ServiceStatus.valueOf(status.trim().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Trạng thái dịch vụ không hợp lệ. Các trạng thái hợp lệ: active, inactive");
        }
        return repository.findByStatus(serviceStatus).stream().map(ServiceMapper::toResponse).toList();
    }
}
