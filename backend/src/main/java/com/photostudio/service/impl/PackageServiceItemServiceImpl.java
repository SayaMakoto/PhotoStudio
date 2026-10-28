package com.photostudio.service.impl;

import com.photostudio.dto.packages.PackageServiceRequest;
import com.photostudio.dto.packages.PackageServiceResponse;
import com.photostudio.mapper.PackageServiceMapper;
import com.photostudio.model.packages.Package;
import com.photostudio.model.packages.PackageService;
import com.photostudio.model.packages.PackageStatus;
import com.photostudio.model.services.ServiceStatus;
import com.photostudio.model.services.StudioService;
import com.photostudio.repository.PackageRepository;
import com.photostudio.repository.PackageServiceRepository;
import com.photostudio.repository.ServiceRepository;
import com.photostudio.service.PackageServiceItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PackageServiceItemServiceImpl implements PackageServiceItemService {
    private final PackageServiceRepository repository;
    private final PackageRepository packageRepository;
    private final ServiceRepository serviceRepository;
    private final PackageServiceMapper mapper;

    @Override @Transactional(readOnly = true)
    public List<PackageServiceResponse> getServicesByPackageId(Long packageId) {
        validateId(packageId, "Mã gói chụp");
        if (!packageRepository.existsById(packageId)) throw new IllegalArgumentException("Không tìm thấy gói chụp với ID: " + packageId);
        return repository.findByPackageEntityId(packageId).stream().map(mapper::toResponse).toList();
    }

    @Override @Transactional(readOnly = true)
    public PackageServiceResponse getById(Long id) {
        validateId(id, "Mã dịch vụ trong gói chụp");
        return repository.findById(id).map(mapper::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy dịch vụ trong gói chụp với ID: " + id));
    }

    @Override
    public PackageServiceResponse addServiceToPackage(PackageServiceRequest request) {
        if (request == null) throw new IllegalArgumentException("Dữ liệu yêu cầu không được để trống");
        request.validate();
        Package pkg = findActivePackage(request.getPackageId());
        StudioService service = findActiveService(request.getServiceId());
        var existing = repository.findByPackageEntityIdAndServiceId(pkg.getId(), service.getId());
        if (existing.isPresent()) {
            PackageService entity = existing.get();
            entity.setQuantity(entity.getQuantity() + (request.getQuantity() != null ? request.getQuantity() : 1));
            return mapper.toResponse(repository.save(entity));
        }
        PackageService entity = new PackageService();
        entity.setPackageEntity(pkg);
        entity.setService(service);
        entity.setQuantity(request.getQuantity() != null ? request.getQuantity() : 1);
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    public PackageServiceResponse updatePackageService(Long id, PackageServiceRequest request) {
        validateId(id, "Mã dịch vụ trong gói chụp");
        if (request == null) throw new IllegalArgumentException("Dữ liệu yêu cầu không được để trống");
        request.validate();
        PackageService entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy dịch vụ trong gói chụp với ID: " + id));
        Package pkg = findActivePackage(request.getPackageId());
        StudioService service = findActiveService(request.getServiceId());
        if (repository.existsByPackageEntityIdAndServiceIdAndIdNot(pkg.getId(), service.getId(), id))
            throw new IllegalArgumentException("Dịch vụ này đã có trong gói chụp");
        entity.setPackageEntity(pkg);
        entity.setService(service);
        if (request.getQuantity() != null) entity.setQuantity(request.getQuantity());
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    public void removeServiceFromPackage(Long id) {
        validateId(id, "Mã dịch vụ trong gói chụp");
        if (!repository.existsById(id)) throw new IllegalArgumentException("Không tìm thấy dịch vụ trong gói chụp với ID: " + id);
        repository.deleteById(id);
    }

    private Package findActivePackage(Long id) {
        Package pkg = packageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy gói chụp với ID: " + id));
        if (pkg.getStatus() != PackageStatus.active)
            throw new IllegalArgumentException("Gói chụp '" + pkg.getName() + "' hiện không hoạt động");
        if (pkg.getDeletedAt() != null)
            throw new IllegalArgumentException("Gói chụp '" + pkg.getName() + "' đang nằm trong thùng rác");
        return pkg;
    }

    private StudioService findActiveService(Long id) {
        StudioService service = serviceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy dịch vụ với ID: " + id));
        if (service.getStatus() != ServiceStatus.active)
            throw new IllegalArgumentException("Dịch vụ '" + service.getName() + "' hiện không hoạt động");
        if (service.getDeletedAt() != null)
            throw new IllegalArgumentException("Dịch vụ '" + service.getName() + "' đang nằm trong thùng rác");
        return service;
    }

    private void validateId(Long id, String field) {
        if (id == null || id <= 0) throw new IllegalArgumentException(field + " không hợp lệ");
    }
}
