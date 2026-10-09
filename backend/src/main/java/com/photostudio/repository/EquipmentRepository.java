
package com.photostudio.repository;

import com.photostudio.model.equipment.Equipment;
import com.photostudio.model.equipment.EquipmentStatus;
import com.photostudio.model.equipment.EquipmentType;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipmentRepository
                extends JpaRepository<Equipment, Long> {

        List<Equipment> findByNameContaining(String name);

        List<Equipment> findByType(EquipmentType type);

        List<Equipment> findByStatus(EquipmentStatus status);

        boolean existsBySerialNumber(String serialNumber);

        boolean existsBySerialNumberAndIdNot(String serialNumber, Long id);
}