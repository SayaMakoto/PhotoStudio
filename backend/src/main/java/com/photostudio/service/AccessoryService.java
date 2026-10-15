package com.photostudio.service;

import com.photostudio.model.accessories.Accessory;
import com.photostudio.model.accessories.AccessoryStatus;
import com.photostudio.model.accessories.AccessoryType;

import java.util.List;
import java.util.Optional;

public interface AccessoryService {
    List<Accessory> getAllAccessories();
    Optional<Accessory> getAccessoryById(Long id);
    Accessory createAccessory(Accessory accessory);
    Accessory updateAccessory(Long id, Accessory accessoryDetails);
    void deleteAccessory(Long id);
    List<Accessory> searchAccessoriesByName(String name);
    List<Accessory> getAccessoriesByType(AccessoryType type);
    List<Accessory> getAccessoriesByStatus(AccessoryStatus status);
}