package com.photostudio.repository;

import com.photostudio.model.images.Image;
import com.photostudio.model.images.ImageableType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {

    // Lấy tất cả ảnh của một đối tượng (ảnh đại diện xếp đầu tiên)
    @Query("SELECT i FROM Image i WHERE i.imageableType = :type AND i.imageableId = :imageableId " +
           "ORDER BY i.isPrimary DESC, i.id ASC")
    List<Image> findByImageable(
            @Param("type") ImageableType type,
            @Param("imageableId") Long imageableId);

    // Lấy các ảnh đang là ảnh đại diện của một đối tượng (trừ ảnh có id = excludeId)
    @Query("SELECT i FROM Image i WHERE i.imageableType = :type AND i.imageableId = :imageableId " +
           "AND i.isPrimary = true AND (:excludeId IS NULL OR i.id != :excludeId)")
    List<Image> findPrimaryImages(
            @Param("type") ImageableType type,
            @Param("imageableId") Long imageableId,
            @Param("excludeId") Long excludeId);
}
