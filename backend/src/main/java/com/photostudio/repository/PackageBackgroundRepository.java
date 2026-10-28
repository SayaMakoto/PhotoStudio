package com.photostudio.repository;

import com.photostudio.model.packages.PackageBackground;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PackageBackgroundRepository extends JpaRepository<PackageBackground, Long> {

    @Query("SELECT pb FROM PackageBackground pb WHERE pb.packageEntity.id = :packageId")
    List<PackageBackground> findByPackageEntityId(@Param("packageId") Long packageId);

    @Query("SELECT pb FROM PackageBackground pb WHERE pb.packageEntity.id = :packageId AND pb.background.id = :backgroundId")
    Optional<PackageBackground> findByPackageEntityIdAndBackgroundId(
            @Param("packageId") Long packageId,
            @Param("backgroundId") Long backgroundId);

    @Query("SELECT CASE WHEN COUNT(pb) > 0 THEN true ELSE false END FROM PackageBackground pb " +
            "WHERE pb.packageEntity.id = :packageId AND pb.background.id = :backgroundId AND pb.id <> :id")
    boolean existsByPackageEntityIdAndBackgroundIdAndIdNot(
            @Param("packageId") Long packageId,
            @Param("backgroundId") Long backgroundId,
            @Param("id") Long id);

    @Query("SELECT CASE WHEN COUNT(pb) > 0 THEN true ELSE false END FROM PackageBackground pb WHERE pb.background.id = :backgroundId")
    boolean existsByBackgroundId(@Param("backgroundId") Long backgroundId);
}
