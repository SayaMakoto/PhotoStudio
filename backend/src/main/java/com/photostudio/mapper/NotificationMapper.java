package com.photostudio.mapper;

import com.photostudio.dto.notifications.NotificationRequest;
import com.photostudio.dto.notifications.NotificationResponse;
import com.photostudio.model.notifications.Notification;
import com.photostudio.model.notifications.NotificationType;
import com.photostudio.model.users.User;

public class NotificationMapper {

    public static Notification toEntity(NotificationRequest request) {
        return toEntity(request, null);
    }

    public static Notification toEntity(NotificationRequest request, User user) {
        Notification notification = new Notification();

        if (user != null) {
            notification.setUser(user);
        } else if (request.getUserId() != null) {
            notification.setUserId(request.getUserId());
        }

        notification.setTitle(request.getTitle().trim());
        notification.setMessage(request.getMessage().trim());
        notification.setType(NotificationType.valueOf(request.getType().trim().toLowerCase()));
        return notification;
    }

    public static void updateEntity(NotificationRequest request, Notification notification) {
        updateEntity(request, notification, null);
    }

    public static void updateEntity(NotificationRequest request, Notification notification, User user) {
        if (user != null) {
            notification.setUser(user);
        } else if (request.getUserId() != null) {
            notification.setUserId(request.getUserId());
        }

        notification.setTitle(request.getTitle().trim());
        notification.setMessage(request.getMessage().trim());
        notification.setType(NotificationType.valueOf(request.getType().trim().toLowerCase()));
    }

    public static NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getUserId(),
                notification.getUser() != null ? notification.getUser().getFullname() : null,
                notification.getTitle(),
                notification.getMessage(),
                notification.getType() != null ? notification.getType().name() : null,
                notification.getReadAt(),
                notification.getCreatedAt()
        );
    }
}
