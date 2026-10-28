package com.photostudio.repository;

import com.photostudio.model.packages.PackageService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface PackageServiceRepository extends JpaRepository<PackageService, Long> {
    List<PackageService> findByPackageEntityId(Long packageId);
    Optional<PackageService> findByPackageEntityIdAndServiceId(Long packageId, Long serviceId);
    boolean existsByPackageEntityIdAndServiceIdAndIdNot(Long packageId, Long serviceId, Long id);

    @Query("SELECT CASE WHEN COUNT(ps) > 0 THEN true ELSE false END FROM PackageService ps WHERE ps.service.id = :serviceId")
    boolean existsByServiceId(@Param("serviceId") Long serviceId);
}
