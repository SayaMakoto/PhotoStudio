package com.photostudio.service.impl;

import com.photostudio.dto.services.ServiceRequest;
import com.photostudio.dto.services.ServiceResponse;
import com.photostudio.mapper.ServiceMapper;
import com.photostudio.model.services.ServiceStatus;
import com.photostudio.model.services.ServiceType;
import com.photostudio.model.services.StudioService;
import com.photostudio.repository.ServiceRepository;
import com.photostudio.repository.PackageServiceRepository;
import com.photostudio.repository.BookingServiceRepository;
import com.photostudio.service.ServiceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDateTime;

@Service
@Transactional
public class ServiceServiceImpl implements ServiceService {

    private final ServiceRepository repository;
    private final PackageServiceRepository packageServiceRepository;
    private final BookingServiceRepository bookingServiceRepository;

    public ServiceServiceImpl(ServiceRepository repository,
                              PackageServiceRepository packageServiceRepository,
                              BookingServiceRepository bookingServiceRepository) {
        this.repository = repository;
        this.packageServiceRepository = packageServiceRepository;
        this.bookingServiceRepository = bookingServiceRepository;
    }

    private StudioService findEntity(Long id) {
        return repository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy dịch vụ có id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceResponse> findAll() {
        return repository.findByDeletedAtIsNullOrderByIdDesc().stream().map(ServiceMapper::toResponse).toList();
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
        StudioService service = findEntity(id);
        if (bookingServiceRepository.existsByServiceId(id)) {
            throw new IllegalArgumentException("Không thể chuyển dịch vụ vào thùng rác vì dịch vụ đã được sử dụng trong đơn đặt lịch. Hãy chuyển trạng thái sang ngừng hoạt động.");
        }
        service.setDeletedAt(LocalDateTime.now());
        repository.save(service);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceResponse> findByName(String name) {
        return repository.findByDeletedAtIsNullAndNameContainingIgnoreCase(name).stream()
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
        return repository.findByDeletedAtIsNullAndType(serviceType).stream().map(ServiceMapper::toResponse).toList();
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
        return repository.findByDeletedAtIsNullAndStatus(serviceStatus).stream().map(ServiceMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceResponse> findTrash() {
        return repository.findByDeletedAtIsNotNullOrderByDeletedAtDesc().stream()
                .map(ServiceMapper::toResponse).toList();
    }

    @Override
    public ServiceResponse restore(Long id) {
        StudioService service = repository.findByIdAndDeletedAtIsNotNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy dịch vụ trong thùng rác có id: " + id));
        service.setDeletedAt(null);
        return ServiceMapper.toResponse(repository.save(service));
    }

    @Override
    public void permanentlyDelete(Long id) {
        StudioService service = repository.findByIdAndDeletedAtIsNotNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy dịch vụ trong thùng rác có id: " + id));
        if (bookingServiceRepository.existsByServiceId(id)) {
            throw new IllegalArgumentException("Không thể xóa vĩnh viễn dịch vụ đã được sử dụng trong đơn đặt lịch.");
        }
        if (packageServiceRepository.existsByServiceId(id)) {
            throw new IllegalArgumentException("Không thể xóa vĩnh viễn dịch vụ đang nằm trong gói chụp. Hãy gỡ dịch vụ khỏi các gói trước.");
        }
        repository.delete(service);
    }
}
