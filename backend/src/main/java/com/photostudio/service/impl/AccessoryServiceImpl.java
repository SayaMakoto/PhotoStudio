package com.photostudio.service.impl;

import com.photostudio.model.accessories.Accessory;
import com.photostudio.model.accessories.AccessoryStatus;
import com.photostudio.model.accessories.AccessoryType;
import com.photostudio.repository.AccessoryRepository;
import com.photostudio.service.AccessoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccessoryServiceImpl implements AccessoryService {

    private final AccessoryRepository accessoryRepository;

    @Override
    public List<Accessory> getAllAccessories() {
        return accessoryRepository.findByDeletedAtIsNullOrderByIdDesc();
    }

    @Override
    public Optional<Accessory> getAccessoryById(Long id) {
        return accessoryRepository.findByIdAndDeletedAtIsNull(id);
    }

    @Override
    @Transactional
    public Accessory createAccessory(Accessory accessory) {
        if (accessory.getStatus() == null) {
            accessory.setStatus(AccessoryStatus.available);
        }
        if (accessory.getQuantity() == null) {
            accessory.setQuantity(0);
        }
        if (accessory.getPrice() == null) {
            accessory.setPrice(0.0);
        }
        return accessoryRepository.save(accessory);
    }

    @Override
    @Transactional
    public Accessory updateAccessory(Long id, Accessory accessoryDetails) {
        Accessory accessory = accessoryRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phụ kiện với ID: " + id));

        accessory.setType(accessoryDetails.getType());
        accessory.setName(accessoryDetails.getName());
        accessory.setDescription(accessoryDetails.getDescription());
        accessory.setQuantity(accessoryDetails.getQuantity());
        accessory.setPrice(accessoryDetails.getPrice());
        if (accessoryDetails.getStatus() != null) {
            accessory.setStatus(accessoryDetails.getStatus());
        }

        return accessoryRepository.save(accessory);
    }

    @Override
    @Transactional
    public void deleteAccessory(Long id) {
        Accessory accessory = accessoryRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phụ kiện với ID: " + id));
        accessory.setDeletedAt(LocalDateTime.now());
        accessoryRepository.save(accessory);
    }

    @Override
    public List<Accessory> searchAccessoriesByName(String name) {
        return accessoryRepository.findByDeletedAtIsNullAndNameContainingIgnoreCase(name);
    }

    @Override
    public List<Accessory> getAccessoriesByType(AccessoryType type) {
        return accessoryRepository.findByDeletedAtIsNullAndType(type);
    }

    @Override
    public List<Accessory> getAccessoriesByStatus(AccessoryStatus status) {
        return accessoryRepository.findByDeletedAtIsNullAndStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Accessory> getTrash() {
        return accessoryRepository.findByDeletedAtIsNotNullOrderByDeletedAtDesc();
    }

    @Override
    @Transactional
    public Accessory restoreAccessory(Long id) {
        Accessory accessory = accessoryRepository.findByIdAndDeletedAtIsNotNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phụ kiện trong thùng rác với ID: " + id));
        accessory.setDeletedAt(null);
        return accessoryRepository.save(accessory);
    }

    @Override
    @Transactional
    public void permanentlyDeleteAccessory(Long id) {
        Accessory accessory = accessoryRepository.findByIdAndDeletedAtIsNotNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phụ kiện trong thùng rác với ID: " + id));
        if (accessoryRepository.existsPackageReference(id)) {
            throw new IllegalArgumentException("Không thể xóa vĩnh viễn phụ kiện đang nằm trong gói chụp. Hãy gỡ phụ kiện khỏi các gói trước.");
        }
        accessoryRepository.delete(accessory);
    }
}
