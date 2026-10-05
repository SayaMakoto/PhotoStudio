package com.photostudio.repository;

import com.photostudio.model.packages.Package;
import com.photostudio.model.packages.PackageStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PackageRepository extends JpaRepository<Package, Long> {

    List<Package> findByNameContaining(String name);

    List<Package> findByStatus(PackageStatus status);
}
