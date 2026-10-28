package com.photostudio.service.impl;

import com.photostudio.dto.packages.PackageRequest;
import com.photostudio.dto.packages.PackageResponse;
import com.photostudio.mapper.PackageMapper;
import com.photostudio.model.packages.Package;
import com.photostudio.model.packages.PackageStatus;
import com.photostudio.repository.PackageRepository;
import com.photostudio.repository.BookingPackageRepository;
import com.photostudio.service.PackageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDateTime;

@Service
@Transactional
public class PackageServiceImpl implements PackageService {

    private final PackageRepository packageRepository;
    private final BookingPackageRepository bookingPackageRepository;

    public PackageServiceImpl(PackageRepository packageRepository, BookingPackageRepository bookingPackageRepository) {
        this.packageRepository = packageRepository;
        this.bookingPackageRepository = bookingPackageRepository;
    }

    private Package findEntity(Long id) {
        validateId(id);
        return packageRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy gói chụp có id: " + id));
    }

    private void validateId(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Mã gói chụp không hợp lệ");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<PackageResponse> findAll() {
        return packageRepository.findByDeletedAtIsNullOrderByIdDesc()
                .stream()
                .map(PackageMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PackageResponse findById(Long id) {
        return PackageMapper.toResponse(findEntity(id));
    }

    @Override
    public PackageResponse create(PackageRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu gói chụp không được để trống");
        }
        request.validate();

        Package pkg = PackageMapper.toEntity(request);
        Package saved = packageRepository.save(pkg);

        return PackageMapper.toResponse(saved);
    }

    @Override
    public PackageResponse update(Long id, PackageRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu gói chụp không được để trống");
        }
        request.validate();

        Package pkg = findEntity(id);
        PackageMapper.updateEntity(request, pkg);

        Package saved = packageRepository.save(pkg);
        return PackageMapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        Package pkg = findEntity(id);
        if (bookingPackageRepository.existsBookingReference(id)) {
            throw new IllegalArgumentException("Không thể chuyển gói chụp vào thùng rác vì gói đã được sử dụng trong đơn đặt lịch.");
        }
        pkg.setDeletedAt(LocalDateTime.now());
        packageRepository.save(pkg);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PackageResponse> findByName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Tên tìm kiếm không được để trống");
        }
        return packageRepository.findByDeletedAtIsNullAndNameContainingIgnoreCase(name.trim())
                .stream()
                .map(PackageMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PackageResponse> findByStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Trạng thái tìm kiếm không được để trống");
        }
        PackageStatus packageStatus;
        try {
            packageStatus = PackageStatus.valueOf(status.trim().toLowerCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Trạng thái gói chụp không hợp lệ. Hợp lệ: active, inactive");
        }
        return packageRepository.findByDeletedAtIsNullAndStatus(packageStatus).stream().map(PackageMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PackageResponse> findTrash() {
        return packageRepository.findByDeletedAtIsNotNullOrderByDeletedAtDesc().stream()
                .map(PackageMapper::toResponse).toList();
    }

    @Override
    public PackageResponse restore(Long id) {
        validateId(id);
        Package pkg = packageRepository.findByIdAndDeletedAtIsNotNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy gói chụp trong thùng rác có id: " + id));
        pkg.setDeletedAt(null);
        return PackageMapper.toResponse(packageRepository.save(pkg));
    }

    @Override
    public void permanentlyDelete(Long id) {
        validateId(id);
        Package pkg = packageRepository.findByIdAndDeletedAtIsNotNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy gói chụp trong thùng rác có id: " + id));
        if (bookingPackageRepository.existsBookingReference(id)) {
            throw new IllegalArgumentException("Không thể xóa vĩnh viễn gói chụp đã được sử dụng trong đơn đặt lịch.");
        }
        packageRepository.delete(pkg);
    }
}
