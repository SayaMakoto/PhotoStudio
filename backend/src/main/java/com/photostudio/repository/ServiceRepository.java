package com.photostudio.repository;

import com.photostudio.model.services.ServiceStatus;
import com.photostudio.model.services.ServiceType;
import com.photostudio.model.services.StudioService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<StudioService, Long> {

    List<StudioService> findByNameContainingIgnoreCase(String name);

    List<StudioService> findByType(ServiceType type);

    List<StudioService> findByStatus(ServiceStatus status);
}
