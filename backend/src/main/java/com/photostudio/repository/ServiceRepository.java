package com.photostudio.repository;

import com.photostudio.model.services.ServiceStatus;
import com.photostudio.model.services.ServiceType;
import com.photostudio.model.services.StudioService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository extends JpaRepository<StudioService, Long> {

    List<StudioService> findByNameContainingIgnoreCase(String name);

    List<StudioService> findByType(ServiceType type);

    List<StudioService> findByStatus(ServiceStatus status);
}
