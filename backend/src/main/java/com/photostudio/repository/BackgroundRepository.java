package com.photostudio.repository;

import com.photostudio.model.backgrounds.Background;
import com.photostudio.model.backgrounds.BackgroundStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BackgroundRepository extends JpaRepository<Background, Long> {

    List<Background> findByNameContainingIgnoreCase(String name);

    List<Background> findByStatus(BackgroundStatus status);
}
