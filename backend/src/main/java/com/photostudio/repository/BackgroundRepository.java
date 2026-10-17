package com.photostudio.repository;

import com.photostudio.model.backgrounds.Background;
import com.photostudio.model.backgrounds.BackgroundStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BackgroundRepository extends JpaRepository<Background, Long> {

    List<Background> findByNameContainingIgnoreCase(String name);

    List<Background> findByStatus(BackgroundStatus status);
}
