package com.photostudio.service.impl;

import com.photostudio.dto.clothes.ClothRequest;
import com.photostudio.dto.clothes.ClothResponse;
import com.photostudio.mapper.ClothMapper;
import com.photostudio.model.clothes.Cloth;
import com.photostudio.model.clothes.ClothStatus;
import com.photostudio.model.clothes.ClothType;
import com.photostudio.repository.ClothRepository;
import com.photostudio.repository.BookingClothingRepository;
import com.photostudio.service.ClothService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDateTime;

@Service
@Transactional
public class ClothServiceImpl implements ClothService {

    private final ClothRepository repository;
    private final BookingClothingRepository bookingClothingRepository;

    public ClothServiceImpl(ClothRepository repository, BookingClothingRepository bookingClothingRepository) {
        this.repository = repository;
        this.bookingClothingRepository = bookingClothingRepository;
    }

    private Cloth findEntity(Long id) {
        return repository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy trang phục có id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClothResponse> findAll() {
        return repository.findByDeletedAtIsNullOrderByIdDesc().stream().map(ClothMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ClothResponse findById(Long id) {
        return ClothMapper.toResponse(findEntity(id));
    }

    @Override
    public ClothResponse create(ClothRequest request) {
        request.validate();
        Cloth saved = repository.save(ClothMapper.toEntity(request));
        return ClothMapper.toResponse(saved);
    }

    @Override
    public ClothResponse update(Long id, ClothRequest request) {
        request.validate();
        Cloth cloth = findEntity(id);
        ClothMapper.updateEntity(request, cloth);
        return ClothMapper.toResponse(repository.save(cloth));
    }

    @Override
    public void delete(Long id) {
        Cloth cloth = findEntity(id);
        cloth.setDeletedAt(LocalDateTime.now());
        repository.save(cloth);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClothResponse> findByName(String name) {
        return repository.findByDeletedAtIsNullAndNameContainingIgnoreCase(name).stream()
                .map(ClothMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClothResponse> findByType(String type) {
        if (type == null || type.isBlank()) {
            throw new IllegalArgumentException("Loại trang phục không được để trống");
        }
        ClothType clothType;
        try {
            clothType = ClothType.valueOf(type.trim().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Loại trang phục không hợp lệ. Các loại hợp lệ: wedding, traditional, casual, suit, cosplay, other");
        }
        return repository.findByDeletedAtIsNullAndType(clothType).stream().map(ClothMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClothResponse> findByStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Trạng thái không được để trống");
        }
        ClothStatus clothStatus;
        try {
            clothStatus = ClothStatus.valueOf(status.trim().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Trạng thái trang phục không hợp lệ. Các trạng thái hợp lệ: available, rented, maintenance, damaged, retired");
        }
        return repository.findByDeletedAtIsNullAndStatus(clothStatus).stream().map(ClothMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClothResponse> findTrash() {
        return repository.findByDeletedAtIsNotNullOrderByDeletedAtDesc().stream()
                .map(ClothMapper::toResponse).toList();
    }

    @Override
    public ClothResponse restore(Long id) {
        Cloth cloth = repository.findByIdAndDeletedAtIsNotNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy trang phục trong thùng rác có id: " + id));
        cloth.setDeletedAt(null);
        return ClothMapper.toResponse(repository.save(cloth));
    }

    @Override
    public void permanentlyDelete(Long id) {
        Cloth cloth = repository.findByIdAndDeletedAtIsNotNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy trang phục trong thùng rác có id: " + id));
        if (repository.existsBookingReference(id)) {
            throw new IllegalArgumentException("Không thể xóa vĩnh viễn trang phục đã được sử dụng trong đơn đặt lịch.");
        }
        repository.delete(cloth);
    }
}
