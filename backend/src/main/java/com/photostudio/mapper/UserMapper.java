package com.photostudio.mapper;

import com.photostudio.dto.user.UserRequestDTO;
import com.photostudio.dto.user.UserResponseDTO;
import com.photostudio.model.users.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    // Chuyển từ Entity sang Response DTO
    public UserResponseDTO toResponseDTO(User user) {
        if (user == null) {
            return null;
        }
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullname(user.getFullname());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setGender(user.getGender());
        dto.setAddress(user.getAddress());
        dto.setPhone(user.getPhone());
        dto.setAvatar(user.getAvatar());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }

    // Chuyển từ Request DTO sang Entity (dùng khi tạo mới)
    public User toEntity(UserRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword()); // Lưu ý: Nên mã hóa mật khẩu (BCrypt) ở tầng Service trước khi lưu
        user.setFullname(dto.getFullname());
        user.setDateOfBirth(dto.getDateOfBirth());
        user.setGender(dto.getGender());
        user.setAddress(dto.getAddress());
        user.setPhone(dto.getPhone());
        user.setAvatar(dto.getAvatar());
        user.setRole(dto.getRole());
        user.setStatus(dto.getStatus());
        return user;
    }

    // Cập nhật dữ liệu từ DTO vào Entity có sẵn (dùng khi update)
    public void updateEntityFromDTO(UserRequestDTO dto, User user) {
        if (dto == null || user == null) {
            return;
        }
        user.setFullname(dto.getFullname());
        user.setDateOfBirth(dto.getDateOfBirth());
        user.setGender(dto.getGender());
        user.setAddress(dto.getAddress());
        user.setPhone(dto.getPhone());
        user.setAvatar(dto.getAvatar());
        if (dto.getRole() != null) {
            user.setRole(dto.getRole());
        }
        if (dto.getStatus() != null) {
            user.setStatus(dto.getStatus());
        }
    }
}