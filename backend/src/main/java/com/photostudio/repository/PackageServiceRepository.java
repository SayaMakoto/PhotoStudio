package com.photostudio.repository;

import com.photostudio.model.packages.PackageService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface PackageServiceRepository extends JpaRepository<PackageService, Long> {
    @Query("SELECT ps FROM PackageService ps WHERE ps.packageEntity.id = :packageId")
    List<PackageService> findByPackageEntityId(@Param("packageId") Long packageId);

    @Query("SELECT ps FROM PackageService ps WHERE ps.packageEntity.id = :packageId AND ps.service.id = :serviceId")
    Optional<PackageService> findByPackageEntityIdAndServiceId(
            @Param("packageId") Long packageId,
            @Param("serviceId") Long serviceId);

    @Query("SELECT COUNT(ps) > 0 FROM PackageService ps WHERE ps.packageEntity.id = :packageId " +
            "AND ps.service.id = :serviceId AND ps.id <> :id")
    boolean existsByPackageEntityIdAndServiceIdAndIdNot(
            @Param("packageId") Long packageId,
            @Param("serviceId") Long serviceId,
            @Param("id") Long id);

    @Query("SELECT CASE WHEN COUNT(ps) > 0 THEN true ELSE false END FROM PackageService ps WHERE ps.service.id = :serviceId")
    boolean existsByServiceId(@Param("serviceId") Long serviceId);
}
