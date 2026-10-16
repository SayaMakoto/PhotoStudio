package com.photostudio.repository;

import com.photostudio.model.accessories.Accessory;
import com.photostudio.model.accessories.AccessoryStatus;
import com.photostudio.model.accessories.AccessoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccessoryRepository extends JpaRepository<Accessory, Long> {
    List<Accessory> findByNameContainingIgnoreCase(String name);
    List<Accessory> findByType(AccessoryType type);
    List<Accessory> findByStatus(AccessoryStatus status);
}