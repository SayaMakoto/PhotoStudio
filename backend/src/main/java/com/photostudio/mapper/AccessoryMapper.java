package com.photostudio.mapper;

import com.photostudio.dto.accessories.AccessoryRequest;
import com.photostudio.dto.accessories.AccessoryResponse;
import com.photostudio.model.accessories.Accessory;
import com.photostudio.model.accessories.AccessoryStatus;
import com.photostudio.model.accessories.AccessoryType;
import org.springframework.stereotype.Component;

@Component
public class AccessoryMapper {

    public AccessoryResponse toResponseDTO(Accessory accessory) {
        if (accessory == null) return null;
        AccessoryResponse dto = new AccessoryResponse();
        dto.setId(accessory.getId());
        if (accessory.getType() != null) {
            dto.setType(accessory.getType().name());
        }
        dto.setName(accessory.getName());
        dto.setDescription(accessory.getDescription());
        dto.setQuantity(accessory.getQuantity());
        dto.setPrice(accessory.getPrice());
        if (accessory.getStatus() != null) {
            dto.setStatus(accessory.getStatus().name());
        }
        dto.setDeletedAt(accessory.getDeletedAt());
        return dto;
    }

    public Accessory toEntity(AccessoryRequest request) {
        if (request == null) return null;
        request.validate();

        Accessory accessory = new Accessory();
        accessory.setType(AccessoryType.valueOf(request.getType().trim().toLowerCase()));
        accessory.setName(request.getName().trim());
        accessory.setDescription(request.getDescription());
        accessory.setQuantity(request.getQuantity() != null ? request.getQuantity() : 0);
        accessory.setPrice(request.getPrice() != null ? request.getPrice() : 0.0);

        if (request.getStatus() != null) {
            accessory.setStatus(AccessoryStatus.valueOf(request.getStatus().trim().toLowerCase()));
        } else {
            accessory.setStatus(AccessoryStatus.available);
        }

        return accessory;
    }

    public void updateEntityFromRequest(AccessoryRequest request, Accessory accessory) {
        if (request == null || accessory == null) return;
        request.validate();

        accessory.setType(AccessoryType.valueOf(request.getType().trim().toLowerCase()));
        accessory.setName(request.getName().trim());
        accessory.setDescription(request.getDescription());
        if (request.getQuantity() != null) {
            accessory.setQuantity(request.getQuantity());
        }
        if (request.getPrice() != null) {
            accessory.setPrice(request.getPrice());
        }
        if (request.getStatus() != null) {
            accessory.setStatus(AccessoryStatus.valueOf(request.getStatus().trim().toLowerCase()));
        }
    }
}
