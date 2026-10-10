package com.photostudio.dto.users;

import com.photostudio.model.users.UserGender;
import com.photostudio.model.users.UserRole;
import com.photostudio.model.users.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String fullname;
    private LocalDate dateOfBirth;
    private UserGender gender;
    private String address;
    private String phone;
    private String avatar;
    private UserRole role;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}