package com.photostudio.repository;

import com.photostudio.model.packages.PackageService;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PackageServiceRepository extends JpaRepository<PackageService, Long> {
    List<PackageService> findByPackageEntityId(Long packageId);
    Optional<PackageService> findByPackageEntityIdAndServiceId(Long packageId, Long serviceId);
    boolean existsByPackageEntityIdAndServiceIdAndIdNot(Long packageId, Long serviceId, Long id);
}
