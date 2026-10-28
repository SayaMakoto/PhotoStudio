package com.photostudio.repository;

import com.photostudio.model.services.ServiceStatus;
import com.photostudio.model.services.ServiceType;
import com.photostudio.model.services.StudioService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceRepository extends JpaRepository<StudioService, Long> {

    List<StudioService> findByNameContainingIgnoreCase(String name);

    List<StudioService> findByType(ServiceType type);

    List<StudioService> findByStatus(ServiceStatus status);

    List<StudioService> findByDeletedAtIsNullOrderByIdDesc();

    List<StudioService> findByDeletedAtIsNotNullOrderByDeletedAtDesc();

    Optional<StudioService> findByIdAndDeletedAtIsNull(Long id);

    Optional<StudioService> findByIdAndDeletedAtIsNotNull(Long id);

    List<StudioService> findByDeletedAtIsNullAndNameContainingIgnoreCase(String name);

    List<StudioService> findByDeletedAtIsNullAndType(ServiceType type);

    List<StudioService> findByDeletedAtIsNullAndStatus(ServiceStatus status);
}
