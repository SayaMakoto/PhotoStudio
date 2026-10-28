package com.photostudio.dto.users;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequest {

    private String oldPassword;
    private String newPassword;
    private String confirmPassword;

    public void validate() {
        if (oldPassword == null || oldPassword.trim().isBlank()) {
            throw new IllegalArgumentException("Mật khẩu hiện tại không được để trống");
        }
        if (newPassword == null || newPassword.trim().isBlank()) {
            throw new IllegalArgumentException("Mật khẩu mới không được để trống");
        }
        if (newPassword.trim().length() < 6) {
            throw new IllegalArgumentException("Mật khẩu mới phải có ít nhất 6 ký tự");
        }
        if (confirmPassword != null && !confirmPassword.isBlank() && !newPassword.equals(confirmPassword)) {
            throw new IllegalArgumentException("Mật khẩu xác nhận không khớp với mật khẩu mới");
        }
    }
}
