
package com.photostudio.repository;

import com.photostudio.model.Equipment;
import com.photostudio.model.EquipmentStatus;
import com.photostudio.model.EquipmentType;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipmentRepository
                extends JpaRepository<Equipment, Long> {

        // Tìm theo tên thiết bị
        List<Equipment> findByNameContaining(String name);

        // Lọc theo loại thiết bị
        List<Equipment> findByType(EquipmentType type);

        // Lọc theo trạng thái
        List<Equipment> findByStatus(EquipmentStatus status);

        // Kiểm tra mã sê-ri đã tồn tại chưa
        boolean existsBySerialNumber(String serialNumber);

        // Kiểm tra mã sê-ri khi cập nhật, loại trừ thiết bị hiện tại
        boolean existsBySerialNumberAndIdNot(String serialNumber, Long id);
}