package com.photostudio.repository;

import com.photostudio.model.clothes.Cloth;
import com.photostudio.model.clothes.ClothStatus;
import com.photostudio.model.clothes.ClothType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClothRepository extends JpaRepository<Cloth, Long> {

    List<Cloth> findByNameContainingIgnoreCase(String name);

    List<Cloth> findByType(ClothType type);

    List<Cloth> findByStatus(ClothStatus status);
}
