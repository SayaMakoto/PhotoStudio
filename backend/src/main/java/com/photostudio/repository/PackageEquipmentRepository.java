package com.photostudio.repository;

import com.photostudio.model.packages.PackageEquipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PackageEquipmentRepository extends JpaRepository<PackageEquipment, Long> {

    List<PackageEquipment> findByPackageEntityId(Long packageId);
}
