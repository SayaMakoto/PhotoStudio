package com.photostudio.repository;

import com.photostudio.model.notifications.Notification;
import com.photostudio.model.notifications.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Tìm kiếm các thông báo theo người nhận (mới nhất trước)
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId ORDER BY n.createdAt DESC, n.id DESC")
    List<Notification> findByUserId(@Param("userId") Long userId);

    // Tìm kiếm các thông báo chưa đọc của người nhận
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.readAt IS NULL " +
           "ORDER BY n.createdAt DESC, n.id DESC")
    List<Notification> findUnreadByUserId(@Param("userId") Long userId);

    // Đếm số thông báo chưa đọc của người nhận (hiển thị badge trên giao diện)
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.readAt IS NULL")
    long countUnreadByUserId(@Param("userId") Long userId);

    // Tìm kiếm các thông báo theo loại
    List<Notification> findByType(NotificationType type);
}
