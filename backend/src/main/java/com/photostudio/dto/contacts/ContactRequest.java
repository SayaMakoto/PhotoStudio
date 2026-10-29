package com.photostudio.dto.contacts;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContactRequest {

    private Long userId;
    private String fullname;
    private String email;
    private String phone;
    private String subject;
    private String message;

    public void validate() {
        if (fullname == null || fullname.isBlank()) {
            throw new IllegalArgumentException("Họ và tên không được để trống");
        }
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email không được để trống");
        }
        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException("Nội dung tin nhắn không được để trống");
        }
    }
}
