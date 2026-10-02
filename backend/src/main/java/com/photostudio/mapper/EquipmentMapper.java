
package com.photostudio.mapper;

import com.photostudio.dto.EquipmentRequest;
import com.photostudio.dto.EquipmentResponse;
import com.photostudio.model.Equipment;
import com.photostudio.model.EquipmentType;
import com.photostudio.model.EquipmentStatus;

public class EquipmentMapper {

    public static Equipment toEntity(EquipmentRequest request) {
        Equipment equipment = new Equipment();

        equipment.setType(
            EquipmentType.valueOf(request.getType())
        );
        equipment.setName(request.getName());
        equipment.setBrand(request.getBrand());
        equipment.setModel(request.getModel());
        equipment.setSerialNumber(request.getSerialNumber());
        equipment.setPurchaseDate(request.getPurchaseDate());
        equipment.setDescription(request.getDescription());

        if (request.getStatus() != null) {
            equipment.setStatus(
                EquipmentStatus.valueOf(request.getStatus())
            );
        }

        return equipment;
    }

    public static void updateEntity(
            EquipmentRequest request, Equipment equipment) {

        equipment.setType(
            EquipmentType.valueOf(request.getType())
        );
        equipment.setName(request.getName());
        equipment.setBrand(request.getBrand());
        equipment.setModel(request.getModel());
        equipment.setSerialNumber(request.getSerialNumber());
        equipment.setPurchaseDate(request.getPurchaseDate());
        equipment.setDescription(request.getDescription());

        if (request.getStatus() != null) {
            equipment.setStatus(
                EquipmentStatus.valueOf(request.getStatus())
            );
        }
    }

    public static EquipmentResponse toResponse(Equipment equipment) {
        return new EquipmentResponse(
            equipment.getId(),
            equipment.getType().name(),
            equipment.getName(),
            equipment.getBrand(),
            equipment.getModel(),
            equipment.getSerialNumber(),
            equipment.getPurchaseDate(),
            equipment.getDescription(),
            equipment.getStatus().name()
        );
    }
}