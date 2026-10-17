package com.photostudio.repository;

import com.photostudio.model.banners.Banner;
import com.photostudio.model.banners.BannerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Long> {

    // Tìm kiếm các banner theo trạng thái (active: hiển thị trên website)
    List<Banner> findByStatus(BannerStatus status);

    // Tìm kiếm banner theo từ khóa trong tiêu đề
    @Query("SELECT b FROM Banner b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Banner> searchByTitle(@Param("keyword") String keyword);
}
