package com.photostudio.dto.notifications;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private Long id;

    private Long userId;

    private String userFullname;

    private String title;

    private String message;

    private String type;

    private LocalDateTime readAt;

    private LocalDateTime createdAt;
}
