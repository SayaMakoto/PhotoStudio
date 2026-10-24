package com.photostudio.mapper;

import com.photostudio.dto.packages.PackageBackgroundResponse;
import com.photostudio.model.packages.PackageBackground;
import org.springframework.stereotype.Component;

@Component
public class PackageBackgroundMapper {

    public PackageBackgroundResponse toResponse(PackageBackground entity) {
        var pkg = entity.getPackageEntity();
        var background = entity.getBackground();
        return new PackageBackgroundResponse(
                entity.getId(),
                entity.getPackageId(),
                pkg != null ? pkg.getName() : null,
                entity.getBackgroundId(),
                background != null ? background.getName() : null,
                background != null ? background.getDescription() : null,
                background != null && background.getStatus() != null ? background.getStatus().name() : null);
    }
}
