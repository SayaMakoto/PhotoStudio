package com.photostudio.service.impl;

import com.photostudio.dto.banners.BannerRequest;
import com.photostudio.dto.banners.BannerResponse;
import com.photostudio.mapper.BannerMapper;
import com.photostudio.model.banners.Banner;
import com.photostudio.model.banners.BannerStatus;
import com.photostudio.repository.BannerRepository;
import com.photostudio.service.BannerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BannerServiceImpl implements BannerService {

    private final BannerRepository repository;

    public BannerServiceImpl(BannerRepository repository) {
        this.repository = repository;
    }

    private Banner findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy banner có id: " + id));
    }

    private BannerStatus parseStatus(String status) {
        try {
            return BannerStatus.valueOf(status.trim().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Trạng thái banner không hợp lệ. Hợp lệ: active, inactive");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<BannerResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(BannerMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BannerResponse findById(Long id) {
        return BannerMapper.toResponse(findEntity(id));
    }

    @Override
    public BannerResponse create(BannerRequest request) {
        request.validate();

        Banner banner = BannerMapper.toEntity(request);
        Banner saved = repository.save(banner);
        return BannerMapper.toResponse(saved);
    }

    @Override
    public BannerResponse update(Long id, BannerRequest request) {
        request.validate();

        Banner banner = findEntity(id);

        BannerMapper.updateEntity(request, banner);
        Banner saved = repository.save(banner);
        return BannerMapper.toResponse(saved);
    }

    @Override
    public BannerResponse updateStatus(Long id, String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Trạng thái không được để trống");
        }

        BannerStatus bannerStatus = parseStatus(status);

        Banner banner = findEntity(id);
        banner.setStatus(bannerStatus);
        Banner saved = repository.save(banner);
        return BannerMapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        Banner banner = findEntity(id);
        repository.delete(banner);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BannerResponse> findByStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Trạng thái tìm kiếm không được để trống");
        }
        return repository.findByStatus(parseStatus(status))
                .stream()
                .map(BannerMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BannerResponse> search(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            throw new IllegalArgumentException("Từ khóa tìm kiếm không được để trống");
        }
        return repository.searchByTitle(keyword.trim())
                .stream()
                .map(BannerMapper::toResponse)
                .toList();
    }
}
