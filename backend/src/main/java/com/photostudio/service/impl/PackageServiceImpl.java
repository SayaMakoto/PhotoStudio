package com.photostudio.service.impl;

import com.photostudio.dto.packages.PackageRequest;
import com.photostudio.dto.packages.PackageResponse;
import com.photostudio.mapper.PackageMapper;
import com.photostudio.model.packages.Package;
import com.photostudio.repository.PackageRepository;
import com.photostudio.service.PackageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PackageServiceImpl implements PackageService {

    private final PackageRepository packageRepository;

    public PackageServiceImpl(PackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    private Package findEntity(Long id) {
        return packageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy gói chụp có id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PackageResponse> findAll() {
        return packageRepository.findAll()
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
        // Kiểm tra dữ liệu đầu vào và kiểm tra equipment_type tồn tại
        request.validate();

        Package pkg = PackageMapper.toEntity(request);
        Package saved = packageRepository.save(pkg);

        return PackageMapper.toResponse(saved);
    }

    @Override
    public PackageResponse update(Long id, PackageRequest request) {
        request.validate();

        Package pkg = findEntity(id);
        PackageMapper.updateEntity(request, pkg);

        Package saved = packageRepository.save(pkg);
        return PackageMapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        Package pkg = findEntity(id);
        packageRepository.delete(pkg);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PackageResponse> findByName(String name) {
        return packageRepository.findByNameContaining(name)
                .stream()
                .map(PackageMapper::toResponse)
                .toList();
    }
}
