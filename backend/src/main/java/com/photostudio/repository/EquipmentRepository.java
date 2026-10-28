
package com.photostudio.repository;

import com.photostudio.model.equipment.Equipment;
import com.photostudio.model.equipment.EquipmentStatus;
import com.photostudio.model.equipment.EquipmentType;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EquipmentRepository
                extends JpaRepository<Equipment, Long> {

        List<Equipment> findByNameContaining(String name);

        List<Equipment> findByNameContainingIgnoreCaseAndDeletedAtIsNull(String name);

        List<Equipment> findByDeletedAtIsNullOrderByIdDesc();

        List<Equipment> findByDeletedAtIsNotNullOrderByDeletedAtDesc();

        Optional<Equipment> findByIdAndDeletedAtIsNull(Long id);

        Optional<Equipment> findByIdAndDeletedAtIsNotNull(Long id);

        List<Equipment> findByType(EquipmentType type);

        List<Equipment> findByTypeAndDeletedAtIsNull(EquipmentType type);

        List<Equipment> findByStatus(EquipmentStatus status);

        boolean existsBySerialNumber(String serialNumber);

        boolean existsBySerialNumberAndIdNot(String serialNumber, Long id);
}
