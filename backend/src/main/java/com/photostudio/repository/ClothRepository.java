package com.photostudio.repository;

import com.photostudio.model.clothes.Cloth;
import com.photostudio.model.clothes.ClothStatus;
import com.photostudio.model.clothes.ClothType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClothRepository extends JpaRepository<Cloth, Long> {

    List<Cloth> findByNameContainingIgnoreCase(String name);

    List<Cloth> findByType(ClothType type);

    List<Cloth> findByStatus(ClothStatus status);
}
