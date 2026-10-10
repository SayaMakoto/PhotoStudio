package com.photostudio.dto.user;

import com.photostudio.model.users.Gender;
import com.photostudio.model.users.Role;
import com.photostudio.model.users.UserStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UserResponseDTO {
    private Long id;
    private String username;
    private String email;
    private String fullname;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String address;
    private String phone;
    private String avatar;
    private Role role;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}