package com.photostudio.dto.users;

import com.photostudio.model.users.Gender;
import com.photostudio.model.users.Role;
import com.photostudio.model.users.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserRequest {

    @NotBlank(message = "Tên đăng nhập không được để trống")
    private String username;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    private String password;

    private String fullname;

    private LocalDate dateOfBirth;

    private Gender gender;

    private String address;

    @Size(max = 11, message = "Số điện thoại tối đa 11 chữ số")
    private String phone;

    private String avatar;

    private Role role;

    private UserStatus status;
}