package com.photostudio.dto.users;

import com.photostudio.model.users.UserGender;
import com.photostudio.model.users.UserRole;
import com.photostudio.model.users.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.Period;
import java.util.regex.Pattern;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {

    private String username;

    private String email;

    private String password;

    private String fullname;

    private LocalDate dateOfBirth;

    private UserGender gender;

    private String address;

    private String phone;

    private String avatar;

    private UserRole role;

    private UserStatus status;

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    // Số điện thoại Việt Nam chuẩn: Bắt đầu bằng 0, số thứ hai là 3, 5, 7, 8, 9, độ dài 10 chữ số
    private static final Pattern PHONE_PATTERN =
            Pattern.compile("^0[3|5|7|8|9][0-9]{8}$");

    public void validate() {
        validate(true);
    }

    public void validate(boolean isCreate) {
        if (isCreate || username != null) {
            if (username == null || username.trim().isBlank()) {
                throw new IllegalArgumentException("Tên đăng nhập không được để trống");
            }
            if (username.length() > 255) {
                throw new IllegalArgumentException("Tên đăng nhập tối đa 255 ký tự");
            }
        }

        if (isCreate || email != null) {
            if (email == null || email.trim().isBlank()) {
                throw new IllegalArgumentException("Email không được để trống");
            }
            if (!EMAIL_PATTERN.matcher(email.trim()).matches()) {
                throw new IllegalArgumentException("Email không hợp lệ");
            }
            if (email.length() > 255) {
                throw new IllegalArgumentException("Email tối đa 255 ký tự");
            }
        }

        if (isCreate) {
            if (password == null || password.trim().isBlank()) {
                throw new IllegalArgumentException("Mật khẩu không được để trống");
            }
            if (password.length() < 6) {
                throw new IllegalArgumentException("Mật khẩu phải có ít nhất 6 ký tự");
            }
            if (password.length() > 255) {
                throw new IllegalArgumentException("Mật khẩu tối đa 255 ký tự");
            }
        } else if (password != null && !password.isBlank()) {
            if (password.length() < 6) {
                throw new IllegalArgumentException("Mật khẩu phải có ít nhất 6 ký tự");
            }
            if (password.length() > 255) {
                throw new IllegalArgumentException("Mật khẩu tối đa 255 ký tự");
            }
        }

        if (fullname != null && fullname.length() > 255) {
            throw new IllegalArgumentException("Họ và tên tối đa 255 ký tự");
        }

        // Kiểm tra số điện thoại: Bắt đầu bằng số 0, số thứ hai là 3, 5, 7, 8, 9, độ dài đúng 10 số
        if (phone != null && !phone.isBlank()) {
            String trimmedPhone = phone.trim().replaceAll("[\\s.-]", "");
            if (trimmedPhone.startsWith("+84")) {
                trimmedPhone = "0" + trimmedPhone.substring(3);
            }
            if (!PHONE_PATTERN.matcher(trimmedPhone).matches()) {
                throw new IllegalArgumentException("Số điện thoại phải bắt đầu bằng số 0, số thứ hai là 3, 5, 7, 8, 9 và có đúng 10 chữ số (VD: 0901234567)");
            }
        }

        // Kiểm tra ngày sinh: Không được lớn hơn ngày hiện tại và phải từ đủ 13 tuổi trở lên
        if (dateOfBirth != null) {
            LocalDate today = LocalDate.now();
            if (dateOfBirth.isAfter(today)) {
                throw new IllegalArgumentException("Ngày sinh không được lớn hơn ngày hiện tại");
            }
            int age = Period.between(dateOfBirth, today).getYears();
            if (age < 13) {
                throw new IllegalArgumentException("Người dùng phải từ đủ 13 tuổi trở lên");
            }
        }

        if (address != null && address.length() > 255) {
            throw new IllegalArgumentException("Địa chỉ tối đa 255 ký tự");
        }

        if (avatar != null && avatar.length() > 255) {
            // Nếu là data URI base64 thì cho phép lưu trữ avatar
            if (!avatar.startsWith("data:image/")) {
                throw new IllegalArgumentException("Đường dẫn ảnh đại diện tối đa 255 ký tự");
            }
        }
    }
}
