package com.photostudio;

import com.photostudio.dto.users.UserRequest;
import com.photostudio.dto.users.UserResponse;
import com.photostudio.model.users.User;
import com.photostudio.model.users.UserGender;
import com.photostudio.model.users.UserRole;
import com.photostudio.model.users.UserStatus;
import com.photostudio.repository.UserRepository;
import com.photostudio.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserValidationTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private UserRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new UserRequest();
        validRequest.setUsername("thanhthuong");
        validRequest.setEmail("thuong@photostudio.vn");
        validRequest.setPassword("password123");
        validRequest.setFullname("Đỗ Thành Thương");
        validRequest.setDateOfBirth(LocalDate.of(2000, 1, 1));
        validRequest.setGender(UserGender.Male);
        validRequest.setPhone("0987654321");
        validRequest.setRole(UserRole.Customer);
        validRequest.setStatus(UserStatus.active);
    }

    @Test
    @DisplayName("Tạo người dùng thành công khi dữ liệu hợp lệ")
    void testCreateUser_Success() {
        when(userRepository.existsByUsername("thanhthuong")).thenReturn(false);
        when(userRepository.existsByEmail("thuong@photostudio.vn")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(1L);
            return u;
        });

        UserResponse response = userService.create(validRequest);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("thanhthuong", response.getUsername());
        assertEquals("thuong@photostudio.vn", response.getEmail());
        assertEquals(UserRole.Customer, response.getRole());
        assertEquals(UserStatus.active, response.getStatus());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Ném ngoại lệ khi tên đăng nhập đã tồn tại")
    void testCreateUser_DuplicateUsername_ThrowsException() {
        when(userRepository.existsByUsername("thanhthuong")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> userService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Tên đăng nhập đã tồn tại"));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi email đã được sử dụng")
    void testCreateUser_DuplicateEmail_ThrowsException() {
        when(userRepository.existsByUsername("thanhthuong")).thenReturn(false);
        when(userRepository.existsByEmail("thuong@photostudio.vn")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> userService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Email đã được sử dụng"));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi mật khẩu quá ngắn (< 6 ký tự)")
    void testCreateUser_ShortPassword_ThrowsException() {
        validRequest.setPassword("12345");

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> userService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Mật khẩu phải có ít nhất 6 ký tự"));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi email không đúng định dạng")
    void testCreateUser_InvalidEmail_ThrowsException() {
        validRequest.setEmail("invalid-email");

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> userService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Email không hợp lệ"));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Cập nhật trạng thái người dùng thành công")
    void testUpdateStatus_Success() {
        User user = new User();
        user.setId(1L);
        user.setUsername("thanhthuong");
        user.setStatus(UserStatus.active);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse response = userService.updateStatus(1L, "banned");

        assertNotNull(response);
        assertEquals(UserStatus.banned, response.getStatus());
        verify(userRepository, times(1)).save(user);
    }
}
