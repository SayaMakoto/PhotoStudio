package com.photostudio.service.impl;

import com.photostudio.dto.backgrounds.BackgroundRequest;
import com.photostudio.dto.backgrounds.BackgroundResponse;
import com.photostudio.mapper.BackgroundMapper;
import com.photostudio.model.backgrounds.Background;
import com.photostudio.model.backgrounds.BackgroundStatus;
import com.photostudio.repository.BackgroundRepository;
import com.photostudio.service.BackgroundService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BackgroundServiceImpl implements BackgroundService {

    private final BackgroundRepository repository;

    public BackgroundServiceImpl(BackgroundRepository repository) {
        this.repository = repository;
    }

    private Background findEntity(Long id) {
        return repository.findById(id)
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
        return repository.findAll().stream().map(BackgroundMapper::toResponse).toList();
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
        repository.delete(findEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BackgroundResponse> findByName(String name) {
        return repository.findByNameContainingIgnoreCase(name).stream()
                .map(BackgroundMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BackgroundResponse> findByStatus(String status) {
        return repository.findByStatus(parseStatus(status)).stream()
                .map(BackgroundMapper::toResponse).toList();
    }
}
