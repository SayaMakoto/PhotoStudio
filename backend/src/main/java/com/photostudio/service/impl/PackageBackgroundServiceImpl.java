package com.photostudio.service.impl;

import com.photostudio.dto.packages.PackageBackgroundRequest;
import com.photostudio.dto.packages.PackageBackgroundResponse;
import com.photostudio.mapper.PackageBackgroundMapper;
import com.photostudio.model.backgrounds.Background;
import com.photostudio.model.backgrounds.BackgroundStatus;
import com.photostudio.model.packages.Package;
import com.photostudio.model.packages.PackageBackground;
import com.photostudio.model.packages.PackageStatus;
import com.photostudio.repository.BackgroundRepository;
import com.photostudio.repository.PackageBackgroundRepository;
import com.photostudio.repository.PackageRepository;
import com.photostudio.service.PackageBackgroundService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PackageBackgroundServiceImpl implements PackageBackgroundService {

    private final PackageBackgroundRepository packageBackgroundRepository;
    private final PackageRepository packageRepository;
    private final BackgroundRepository backgroundRepository;
    private final PackageBackgroundMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<PackageBackgroundResponse> getBackgroundsByPackageId(Long packageId) {
        validateId(packageId, "Mã gói chụp");
        if (!packageRepository.existsById(packageId)) {
            throw new IllegalArgumentException("Không tìm thấy gói chụp với ID: " + packageId);
        }
        return packageBackgroundRepository.findByPackageEntityId(packageId).stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PackageBackgroundResponse getById(Long id) {
        validateId(id, "Mã bối cảnh trong gói chụp");
        return packageBackgroundRepository.findById(id).map(mapper::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bối cảnh trong gói chụp với ID: " + id));
    }

    @Override
    public PackageBackgroundResponse addBackgroundToPackage(PackageBackgroundRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu yêu cầu không được để trống");
        }
        request.validate();
        Package pkg = findActivePackage(request.getPackageId());
        Background background = findActiveBackground(request.getBackgroundId());

        var existing = packageBackgroundRepository.findByPackageEntityIdAndBackgroundId(pkg.getId(), background.getId());
        if (existing.isPresent()) {
            return mapper.toResponse(existing.get());
        }

        PackageBackground entity = new PackageBackground();
        entity.setPackageEntity(pkg);
        entity.setBackground(background);
        return mapper.toResponse(packageBackgroundRepository.save(entity));
    }

    @Override
    public PackageBackgroundResponse updatePackageBackground(Long id, PackageBackgroundRequest request) {
        validateId(id, "Mã bối cảnh trong gói chụp");
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu yêu cầu không được để trống");
        }
        request.validate();
        PackageBackground entity = packageBackgroundRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bối cảnh trong gói chụp với ID: " + id));
        Package pkg = findActivePackage(request.getPackageId());
        Background background = findActiveBackground(request.getBackgroundId());

        if (packageBackgroundRepository.existsByPackageEntityIdAndBackgroundIdAndIdNot(
                pkg.getId(), background.getId(), id)) {
            throw new IllegalArgumentException("Bối cảnh này đã có trong gói chụp");
        }

        entity.setPackageEntity(pkg);
        entity.setBackground(background);
        return mapper.toResponse(packageBackgroundRepository.save(entity));
    }

    @Override
    public void removeBackgroundFromPackage(Long id) {
        validateId(id, "Mã bối cảnh trong gói chụp");
        if (!packageBackgroundRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy bối cảnh trong gói chụp với ID: " + id);
        }
        packageBackgroundRepository.deleteById(id);
    }

    private Package findActivePackage(Long id) {
        Package pkg = packageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy gói chụp với ID: " + id));
        if (pkg.getStatus() != PackageStatus.active) {
            throw new IllegalArgumentException("Gói chụp '" + pkg.getName() + "' hiện không hoạt động");
        }
        return pkg;
    }

    private Background findActiveBackground(Long id) {
        Background background = backgroundRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bối cảnh với ID: " + id));
        if (background.getDeletedAt() != null) {
            throw new IllegalArgumentException("Bối cảnh '" + background.getName() + "' đang nằm trong thùng rác");
        }
        if (background.getStatus() != BackgroundStatus.active) {
            throw new IllegalArgumentException("Bối cảnh '" + background.getName() + "' hiện không hoạt động");
        }
        return background;
    }

    private void validateId(Long id, String field) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException(field + " không hợp lệ");
        }
    }
}
