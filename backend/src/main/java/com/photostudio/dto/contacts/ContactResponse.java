package com.photostudio.dto.contacts;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContactResponse {

    private Long id;
    private Long userId;
    private String fullname;
    private String email;
    private String phone;
    private String subject;
    private String message;
    private String status;
    private String replyMessage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
