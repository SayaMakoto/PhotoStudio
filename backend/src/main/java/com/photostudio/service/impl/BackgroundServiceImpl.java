package com.photostudio.service.impl;

import com.photostudio.dto.backgrounds.BackgroundRequest;
import com.photostudio.dto.backgrounds.BackgroundResponse;
import com.photostudio.mapper.BackgroundMapper;
import com.photostudio.model.backgrounds.Background;
import com.photostudio.model.backgrounds.BackgroundStatus;
import com.photostudio.repository.BackgroundRepository;
import com.photostudio.repository.PackageBackgroundRepository;
import com.photostudio.service.BackgroundService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDateTime;

@Service
@Transactional
public class BackgroundServiceImpl implements BackgroundService {

    private final BackgroundRepository repository;
    private final PackageBackgroundRepository packageBackgroundRepository;

    public BackgroundServiceImpl(BackgroundRepository repository,
                                 PackageBackgroundRepository packageBackgroundRepository) {
        this.repository = repository;
        this.packageBackgroundRepository = packageBackgroundRepository;
    }

    private Background findEntity(Long id) {
        return repository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bối cảnh có id: " + id));
    }

    private BackgroundStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Trạng thái không được để trống");
        }
        try {
            return BackgroundStatus.valueOf(status.trim().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Trạng thái bối cảnh không hợp lệ. Các trạng thái hợp lệ: active, inactive, maintenance");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<BackgroundResponse> findAll() {
        return repository.findByDeletedAtIsNull().stream().map(BackgroundMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BackgroundResponse findById(Long id) {
        return BackgroundMapper.toResponse(findEntity(id));
    }

    @Override
    public BackgroundResponse create(BackgroundRequest request) {
        request.validate();
        Background saved = repository.save(BackgroundMapper.toEntity(request));
        return BackgroundMapper.toResponse(saved);
    }

    @Override
    public BackgroundResponse update(Long id, BackgroundRequest request) {
        request.validate();
        Background background = findEntity(id);
        BackgroundMapper.updateEntity(request, background);
        return BackgroundMapper.toResponse(repository.save(background));
    }

    @Override
    public void delete(Long id) {
        Background background = findEntity(id);
        background.setDeletedAt(LocalDateTime.now());
        repository.save(background);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BackgroundResponse> findByName(String name) {
        return repository.findByDeletedAtIsNullAndNameContainingIgnoreCase(name).stream()
                .map(BackgroundMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BackgroundResponse> findByStatus(String status) {
        return repository.findByDeletedAtIsNullAndStatus(parseStatus(status)).stream()
                .map(BackgroundMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BackgroundResponse> findTrash() {
        return repository.findByDeletedAtIsNotNullOrderByDeletedAtDesc().stream()
                .map(BackgroundMapper::toResponse).toList();
    }

    @Override
    public BackgroundResponse restore(Long id) {
        Background background = repository.findByIdAndDeletedAtIsNotNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bối cảnh trong thùng rác: " + id));
        background.setDeletedAt(null);
        return BackgroundMapper.toResponse(repository.save(background));
    }

    @Override
    public void permanentlyDelete(Long id) {
        Background background = repository.findByIdAndDeletedAtIsNotNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bối cảnh trong thùng rác: " + id));
        if (packageBackgroundRepository.existsByBackgroundId(id)) {
            throw new IllegalArgumentException("Không thể xóa vĩnh viễn bối cảnh đã được sử dụng trong gói chụp hoặc đơn đặt lịch.");
        }
        repository.delete(background);
    }
}
