package com.photostudio.repository;

import com.photostudio.model.packages.Package;
import com.photostudio.model.packages.PackageStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PackageRepository extends JpaRepository<Package, Long> {

    List<Package> findByNameContainingIgnoreCase(String name);

    List<Package> findByStatus(PackageStatus status);

    List<Package> findByDeletedAtIsNullOrderByIdDesc();

    List<Package> findByDeletedAtIsNotNullOrderByDeletedAtDesc();

    Optional<Package> findByIdAndDeletedAtIsNull(Long id);

    Optional<Package> findByIdAndDeletedAtIsNotNull(Long id);

    List<Package> findByDeletedAtIsNullAndNameContainingIgnoreCase(String name);

    List<Package> findByDeletedAtIsNullAndStatus(PackageStatus status);
}
