package com.photostudio.repository;

import com.photostudio.model.backgrounds.Background;
import com.photostudio.model.backgrounds.BackgroundStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BackgroundRepository extends JpaRepository<Background, Long> {

    List<Background> findByNameContainingIgnoreCase(String name);

    List<Background> findByStatus(BackgroundStatus status);

    List<Background> findByDeletedAtIsNull();

    List<Background> findByDeletedAtIsNotNullOrderByDeletedAtDesc();

    Optional<Background> findByIdAndDeletedAtIsNull(Long id);

    Optional<Background> findByIdAndDeletedAtIsNotNull(Long id);

    List<Background> findByDeletedAtIsNullAndNameContainingIgnoreCase(String name);

    List<Background> findByDeletedAtIsNullAndStatus(BackgroundStatus status);
}
