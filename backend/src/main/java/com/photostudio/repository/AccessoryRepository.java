package com.photostudio.repository;

import com.photostudio.model.accessories.Accessory;
import com.photostudio.model.accessories.AccessoryStatus;
import com.photostudio.model.accessories.AccessoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AccessoryRepository extends JpaRepository<Accessory, Long> {
    List<Accessory> findByNameContainingIgnoreCase(String name);
    List<Accessory> findByType(AccessoryType type);
    List<Accessory> findByStatus(AccessoryStatus status);

    List<Accessory> findByDeletedAtIsNullOrderByIdDesc();

    List<Accessory> findByDeletedAtIsNotNullOrderByDeletedAtDesc();

    Optional<Accessory> findByIdAndDeletedAtIsNull(Long id);

    Optional<Accessory> findByIdAndDeletedAtIsNotNull(Long id);

    List<Accessory> findByDeletedAtIsNullAndNameContainingIgnoreCase(String name);

    List<Accessory> findByDeletedAtIsNullAndType(AccessoryType type);

    List<Accessory> findByDeletedAtIsNullAndStatus(AccessoryStatus status);

    @Query("SELECT CASE WHEN COUNT(pa) > 0 THEN true ELSE false END FROM PackageAccessory pa WHERE pa.accessory.id = :accessoryId")
    boolean existsPackageReference(@Param("accessoryId") Long accessoryId);

}
