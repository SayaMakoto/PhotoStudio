package com.photostudio.controller;

import com.photostudio.dto.users.UserRequest;
import com.photostudio.dto.users.UserResponse;
import com.photostudio.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    private UserResponse getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập");
        }
        return userService.findByUsername(authentication.getName());
    }

    private UserResponse updateOwnProfile(UserResponse currentUser, UserRequest request) {
        // Tài khoản tự cập nhật thông tin cá nhân, không được tự đổi username, role hoặc status.
        request.setUsername(currentUser.getUsername());
        request.setRole(null);
        request.setStatus(null);
        return userService.update(currentUser.getId(), request);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(getAuthenticatedUser(authentication));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateMyProfile(
            @RequestBody UserRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(updateOwnProfile(getAuthenticatedUser(authentication), request));
    }

    // Lấy tất cả người dùng
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    // Lấy người dùng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    // Lấy người dùng theo username
    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponse> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.findByUsername(username));
    }

    // Lấy người dùng theo email
    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.findByEmail(email));
    }

    // Tạo mới người dùng
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody UserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.create(request));
    }

    // Đăng ký tài khoản (No Auth theo yêu cầu đề bài Lab 6)
    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@RequestBody UserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.register(request));
    }

    // Đăng xuất (xóa SecurityContext và vô hiệu hóa session nếu có theo ca B09)
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
        SecurityContextHolder.clearContext();
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok(Map.of("message", "Đăng xuất thành công"));
    }

    // Cập nhật thông tin người dùng
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @RequestBody UserRequest request,
            Authentication authentication) {
        UserResponse currentUser = getAuthenticatedUser(authentication);
        if (!currentUser.getId().equals(id)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Bạn chỉ được chỉnh sửa thông tin tài khoản của chính mình"
            );
        }
        return ResponseEntity.ok(updateOwnProfile(currentUser, request));
    }

    // Cập nhật trạng thái người dùng (active, inactive, banned)
    @PatchMapping("/{id}/status")
    public ResponseEntity<UserResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            @RequestParam(required = false) String status) {
        String targetStatus = status;
        if ((targetStatus == null || targetStatus.isBlank()) && body != null) {
            targetStatus = body.get("status");
        }
        return ResponseEntity.ok(userService.updateStatus(id, targetStatus));
    }

    // Lọc theo Role (Customer, Employee, Admin)
    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserResponse>> getUsersByRole(@PathVariable String role) {
        return ResponseEntity.ok(userService.findByRole(role));
    }

    // Lọc theo Status (active, inactive, banned)
    @GetMapping("/status/{status}")
    public ResponseEntity<List<UserResponse>> getUsersByStatus(@PathVariable String status) {
        return ResponseEntity.ok(userService.findByStatus(status));
    }

    // Tìm kiếm theo tên (fullname)
    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchByName(@RequestParam(required = false, defaultValue = "") String keyword) {
        return ResponseEntity.ok(userService.searchByName(keyword));
    }
}
