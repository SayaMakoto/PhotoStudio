package com.photostudio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.photostudio.model.contents.Content;
import com.photostudio.model.contents.ContentStatus;
import com.photostudio.model.contents.ContentType;

public interface ContentRepository extends JpaRepository<Content, Long> {

    // Tìm nội dung theo slug (dùng cho trang chi tiết ngoài website)
    Optional<Content> findBySlug(String slug);

    // Tìm nội dung theo loại (page / post)
    List<Content> findByType(ContentType type);

    // Tìm nội dung theo trạng thái (draft / published / hidden)
    List<Content> findByStatus(ContentStatus status);

    // Tìm nội dung theo loại và trạng thái (vd: danh sách bài viết đã đăng)
    List<Content> findByTypeAndStatus(ContentType type, ContentStatus status);

    // Tìm kiếm theo từ khóa trong tiêu đề
    @Query("SELECT c FROM Content c WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Content> searchByTitle(@Param("keyword") String keyword);

    // Kiểm tra trùng slug (slug là duy nhất), bỏ qua chính bản ghi đang cập nhật
    @Query("SELECT COUNT(c) > 0 FROM Content c WHERE c.slug = :slug " +
            "AND (:id IS NULL OR c.id != :id)")
    boolean existsSlugConflict(@Param("slug") String slug, @Param("id") Long id);
}
