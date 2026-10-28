package com.photostudio.repository;

import com.photostudio.model.clothes.Cloth;
import com.photostudio.model.clothes.ClothStatus;
import com.photostudio.model.clothes.ClothType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClothRepository extends JpaRepository<Cloth, Long> {

    List<Cloth> findByNameContainingIgnoreCase(String name);

    List<Cloth> findByType(ClothType type);

    List<Cloth> findByStatus(ClothStatus status);

    List<Cloth> findByDeletedAtIsNullOrderByIdDesc();

    List<Cloth> findByDeletedAtIsNotNullOrderByDeletedAtDesc();

    Optional<Cloth> findByIdAndDeletedAtIsNull(Long id);

    Optional<Cloth> findByIdAndDeletedAtIsNotNull(Long id);

    List<Cloth> findByDeletedAtIsNullAndNameContainingIgnoreCase(String name);

    List<Cloth> findByDeletedAtIsNullAndType(ClothType type);

    List<Cloth> findByDeletedAtIsNullAndStatus(ClothStatus status);

    @Query("SELECT CASE WHEN COUNT(bc) > 0 THEN true ELSE false END FROM BookingClothing bc WHERE bc.cloth.id = :clothId")
    boolean existsBookingReference(@Param("clothId") Long clothId);
}
