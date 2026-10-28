package com.photostudio.mapper;

import com.photostudio.dto.services.ServiceRequest;
import com.photostudio.dto.services.ServiceResponse;
import com.photostudio.model.services.ServiceStatus;
import com.photostudio.model.services.ServiceType;
import com.photostudio.model.services.StudioService;

public class ServiceMapper {

    public static StudioService toEntity(ServiceRequest request) {
        StudioService service = new StudioService();
        service.setName(request.getName().trim());
        service.setType(ServiceType.valueOf(request.getType().trim().toLowerCase()));
        service.setDescription(request.getDescription());
        service.setDuration(request.getDuration() != null ? request.getDuration() : 0);
        service.setPrice(request.getPrice() != null ? request.getPrice() : 0.0);

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            service.setStatus(ServiceStatus.valueOf(request.getStatus().trim().toLowerCase()));
        } else {
            service.setStatus(ServiceStatus.active);
        }

        return service;
    }

    public static void updateEntity(ServiceRequest request, StudioService service) {
        service.setName(request.getName().trim());
        service.setType(ServiceType.valueOf(request.getType().trim().toLowerCase()));
        service.setDescription(request.getDescription());
        if (request.getDuration() != null) {
            service.setDuration(request.getDuration());
        }
        if (request.getPrice() != null) {
            service.setPrice(request.getPrice());
        }
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            service.setStatus(ServiceStatus.valueOf(request.getStatus().trim().toLowerCase()));
        }
    }

    public static ServiceResponse toResponse(StudioService service) {
        return new ServiceResponse(
                service.getId(),
                service.getName(),
                service.getType() != null ? service.getType().name() : null,
                service.getDescription(),
                service.getDuration(),
                service.getPrice(),
                service.getStatus() != null ? service.getStatus().name() : null,
                service.getCreatedAt(),
                service.getUpdatedAt(),
                service.getDeletedAt()
        );
    }
}
