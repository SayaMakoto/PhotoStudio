
package com.photostudio.service.impl;

import com.photostudio.dto.equipment.EquipmentRequest;
import com.photostudio.dto.equipment.EquipmentResponse;
import com.photostudio.mapper.EquipmentMapper;
import com.photostudio.model.equipment.Equipment;
import com.photostudio.model.equipment.EquipmentType;
import com.photostudio.repository.EquipmentRepository;
import com.photostudio.service.EquipmentService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EquipmentServiceImpl implements EquipmentService {

    private final EquipmentRepository repository;
    public EquipmentServiceImpl(EquipmentRepository repository) {
        this.repository = repository;
    }

    private Equipment findEntity(Long id) {
        return repository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy thiết bị có id: " + id));
    }

    private EquipmentResponse toResponse(Equipment e) {
        return new EquipmentResponse(
                e.getId(),
                e.getType().name(),
                e.getName(),
                e.getBrand(),
                e.getModel(),
                e.getSerialNumber(),
                e.getPurchaseDate(),
                e.getDescription(),
                e.getStatus().name(),
                e.getDeletedAt());
    }

    private void copyRequest(
            EquipmentRequest request, Equipment equipment) {

        equipment.setType(
                com.photostudio.model.equipment.EquipmentType.valueOf(request.getType()));

        equipment.setName(request.getName());
        equipment.setBrand(request.getBrand());
        equipment.setModel(request.getModel());
        equipment.setSerialNumber(request.getSerialNumber());
        equipment.setPurchaseDate(request.getPurchaseDate());
        equipment.setDescription(request.getDescription());

        if (request.getStatus() != null) {
            equipment.setStatus(
                    com.photostudio.model.equipment.EquipmentStatus.valueOf(
                            request.getStatus()));
        }
    }

    private void checkSerial(String serial, Long id) {
        if (serial == null || serial.isBlank()) {
            return;
        }

        boolean exists = id == null
                ? repository.existsBySerialNumber(serial)
                : repository.existsBySerialNumberAndIdNot(serial, id);

        if (exists) {
            throw new IllegalArgumentException(
                    "Số serial đã tồn tại");
        }
    }

    @Override
    public List<EquipmentResponse> findAll() {
        return repository.findByDeletedAtIsNullOrderByIdDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<EquipmentResponse> findTrash() {
        return repository.findByDeletedAtIsNotNullOrderByDeletedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public EquipmentResponse findById(Long id) {
        return toResponse(findEntity(id));
    }

    @Override
    public EquipmentResponse create(EquipmentRequest request) {
        request.validate();
        checkSerial(request.getSerialNumber(), null);

        Equipment equipment = new Equipment();
        copyRequest(request, equipment);

        Equipment saved = repository.save(equipment);
        return toResponse(saved);
    }

    @Override
    public EquipmentResponse update(
            Long id, EquipmentRequest request) {

        request.validate();

        Equipment equipment = findEntity(id);
        checkSerial(request.getSerialNumber(), id);

        copyRequest(request, equipment);

        Equipment saved = repository.save(equipment);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Equipment equipment = findEntity(id);
        equipment.setDeletedAt(LocalDateTime.now());
        repository.save(equipment);
    }

    @Override
    @Transactional
    public EquipmentResponse restore(Long id) {
        Equipment equipment = repository.findByIdAndDeletedAtIsNotNull(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy thiết bị trong thùng rác có id: " + id));
        equipment.setDeletedAt(null);
        return toResponse(repository.save(equipment));
    }

    @Override
    @Transactional
    public void permanentlyDelete(Long id) {
        Equipment equipment = repository.findByIdAndDeletedAtIsNotNull(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy thiết bị trong thùng rác có id: " + id));
        repository.delete(equipment);
    }

    @Override
    public List<EquipmentResponse> findByName(String name) {
        return repository.findByNameContainingIgnoreCaseAndDeletedAtIsNull(name)
                .stream()
                .map(EquipmentMapper::toResponse)
                .toList();
    }

    @Override
    public List<EquipmentResponse> findByType(String type) {
        EquipmentType equipmentType;

        try {
            equipmentType = EquipmentType.valueOf(type.toLowerCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new IllegalArgumentException(
                    "Loại thiết bị không hợp lệ. Các loại hợp lệ: camera, lens, lighting, tripod, other");
        }

        return repository.findByTypeAndDeletedAtIsNull(equipmentType)
                .stream()
                .map(EquipmentMapper::toResponse)
                .toList();
    }
}
