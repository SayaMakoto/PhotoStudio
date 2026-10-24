package com.photostudio.mapper;

import com.photostudio.dto.packages.PackageServiceResponse;
import com.photostudio.model.packages.PackageService;
import org.springframework.stereotype.Component;

@Component
public class PackageServiceMapper {
    public PackageServiceResponse toResponse(PackageService entity) {
        var service = entity.getService();
        int quantity = entity.getQuantity() != null ? entity.getQuantity() : 0;
        double price = service != null && service.getPrice() != null ? service.getPrice() : 0.0;
        return new PackageServiceResponse(entity.getId(), entity.getPackageId(), entity.getServiceId(),
                service != null ? service.getName() : null,
                service != null && service.getType() != null ? service.getType().name() : null,
                entity.getQuantity(), price, price * quantity);
    }
}
