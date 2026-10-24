package com.photostudio.service;

import com.photostudio.dto.notifications.NotificationRequest;
import com.photostudio.dto.notifications.NotificationResponse;

import java.util.List;

public interface NotificationService {

    List<NotificationResponse> findAll();

    NotificationResponse findById(Long id);

    NotificationResponse create(NotificationRequest request);

    NotificationResponse update(Long id, NotificationRequest request);

    NotificationResponse markAsRead(Long id);

    int markAllAsRead(Long userId);

    void delete(Long id);

    List<NotificationResponse> findByUserId(Long userId);

    List<NotificationResponse> findUnreadByUserId(Long userId);

    long countUnreadByUserId(Long userId);

    List<NotificationResponse> findByType(String type);
}
