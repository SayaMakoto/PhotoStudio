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
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccessoryServiceImpl implements AccessoryService {

    private final AccessoryRepository accessoryRepository;

    @Override
    public List<Accessory> getAllAccessories() {
        return accessoryRepository.findAll();
    }

    @Override
    public Optional<Accessory> getAccessoryById(Long id) {
        return accessoryRepository.findById(id);
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
        Accessory accessory = accessoryRepository.findById(id)
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
        if (!accessoryRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy phụ kiện với ID: " + id);
        }
        accessoryRepository.deleteById(id);
    }

    @Override
    public List<Accessory> searchAccessoriesByName(String name) {
        return accessoryRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public List<Accessory> getAccessoriesByType(AccessoryType type) {
        return accessoryRepository.findByType(type);
    }

    @Override
    public List<Accessory> getAccessoriesByStatus(AccessoryStatus status) {
        return accessoryRepository.findByStatus(status);
    }
}