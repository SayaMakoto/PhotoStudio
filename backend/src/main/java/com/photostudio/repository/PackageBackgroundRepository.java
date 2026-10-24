package com.photostudio.repository;

import com.photostudio.model.packages.PackageBackground;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PackageBackgroundRepository extends JpaRepository<PackageBackground, Long> {

    List<PackageBackground> findByPackageEntityId(Long packageId);

    Optional<PackageBackground> findByPackageEntityIdAndBackgroundId(Long packageId, Long backgroundId);

    boolean existsByPackageEntityIdAndBackgroundIdAndIdNot(Long packageId, Long backgroundId, Long id);
}
