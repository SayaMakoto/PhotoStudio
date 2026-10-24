package com.photostudio;

import com.photostudio.dto.notifications.NotificationRequest;
import com.photostudio.dto.notifications.NotificationResponse;
import com.photostudio.model.notifications.Notification;
import com.photostudio.model.notifications.NotificationType;
import com.photostudio.model.users.User;
import com.photostudio.repository.NotificationRepository;
import com.photostudio.repository.UserRepository;
import com.photostudio.service.impl.NotificationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationValidationTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    private NotificationRequest validRequest;
    private User testUser;

    @BeforeEach
    void setUp() {
        validRequest = new NotificationRequest();
        validRequest.setUserId(1L);
        validRequest.setTitle("Đặt lịch thành công");
        validRequest.setMessage("Lịch chụp ngày 15/10/2026 lúc 09:00 đã được xác nhận");
        validRequest.setType("booking");

        testUser = new User();
        testUser.setId(1L);
        testUser.setFullname("Đỗ Thành Thương");
    }

    private Notification buildNotification(Long id, LocalDateTime readAt) {
        Notification notification = new Notification();
        notification.setId(id);
        notification.setUser(testUser);
        notification.setTitle("Thông báo");
        notification.setMessage("Nội dung");
        notification.setType(NotificationType.system);
        notification.setReadAt(readAt);
        return notification;
    }

    @Test
    @DisplayName("Tạo thông báo thành công khi người nhận hợp lệ")
    void testCreateNotification_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> {
            Notification notification = invocation.getArgument(0);
            notification.setId(100L);
            return notification;
        });

        NotificationResponse response = notificationService.create(validRequest);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals(1L, response.getUserId());
        assertEquals("Đỗ Thành Thương", response.getUserFullname());
        assertEquals("Đặt lịch thành công", response.getTitle());
        assertEquals("booking", response.getType());
        assertNull(response.getReadAt());
        verify(userRepository, times(1)).findById(1L);
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    @DisplayName("Ném ngoại lệ khi người nhận (User) không tồn tại")
    void testCreateNotification_UserNotFound_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> notificationService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy người dùng có id: 1"));
        verify(notificationRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi thiếu hoặc sai userId")
    void testCreateNotification_InvalidUserId_ThrowsException() {
        validRequest.setUserId(null);
        IllegalArgumentException ex1 = assertThrows(
                IllegalArgumentException.class,
                () -> notificationService.create(validRequest)
        );
        assertTrue(ex1.getMessage().contains("Mã người nhận (userId) không hợp lệ"));

        validRequest.setUserId(0L);
        IllegalArgumentException ex2 = assertThrows(
                IllegalArgumentException.class,
                () -> notificationService.create(validRequest)
        );
        assertTrue(ex2.getMessage().contains("Mã người nhận (userId) không hợp lệ"));

        verify(userRepository, never()).findById(any());
        verify(notificationRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi thiếu tiêu đề hoặc nội dung")
    void testCreateNotification_MissingTitleOrMessage_ThrowsException() {
        validRequest.setTitle("  ");
        IllegalArgumentException ex1 = assertThrows(
                IllegalArgumentException.class,
                () -> notificationService.create(validRequest)
        );
        assertTrue(ex1.getMessage().contains("Tiêu đề thông báo (title) không được để trống"));

        validRequest.setTitle("Tiêu đề hợp lệ");
        validRequest.setMessage(null);
        IllegalArgumentException ex2 = assertThrows(
                IllegalArgumentException.class,
                () -> notificationService.create(validRequest)
        );
        assertTrue(ex2.getMessage().contains("Nội dung thông báo (message) không được để trống"));

        verify(notificationRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi tiêu đề hoặc nội dung vượt quá 255 ký tự")
    void testCreateNotification_TooLongFields_ThrowsException() {
        validRequest.setTitle("a".repeat(256));
        IllegalArgumentException ex1 = assertThrows(
                IllegalArgumentException.class,
                () -> notificationService.create(validRequest)
        );
        assertTrue(ex1.getMessage().contains("Tiêu đề thông báo tối đa 255 ký tự"));

        validRequest.setTitle("Tiêu đề hợp lệ");
        validRequest.setMessage("a".repeat(256));
        IllegalArgumentException ex2 = assertThrows(
                IllegalArgumentException.class,
                () -> notificationService.create(validRequest)
        );
        assertTrue(ex2.getMessage().contains("Nội dung thông báo tối đa 255 ký tự"));

        verify(notificationRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi thiếu hoặc sai loại thông báo")
    void testCreateNotification_InvalidType_ThrowsException() {
        validRequest.setType(null);
        IllegalArgumentException ex1 = assertThrows(
                IllegalArgumentException.class,
                () -> notificationService.create(validRequest)
        );
        assertTrue(ex1.getMessage().contains("Loại thông báo (type) không được để trống"));

        validRequest.setType("promotion");
        IllegalArgumentException ex2 = assertThrows(
                IllegalArgumentException.class,
                () -> notificationService.create(validRequest)
        );
        assertTrue(ex2.getMessage().contains("Loại thông báo không hợp lệ"));

        verify(notificationRepository, never()).save(any());
    }

    @Test
    @DisplayName("Cập nhật thông báo thành công")
    void testUpdateNotification_Success() {
        Notification existing = buildNotification(10L, null);

        validRequest.setType("payment");
        validRequest.setTitle("Thanh toán thành công");

        when(notificationRepository.findById(10L)).thenReturn(Optional.of(existing));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> invocation.getArgument(0));

        NotificationResponse response = notificationService.update(10L, validRequest);

        assertEquals("Thanh toán thành công", response.getTitle());
        assertEquals("payment", response.getType());
        verify(notificationRepository, times(1)).save(existing);
    }

    @Test
    @DisplayName("Ném ngoại lệ khi cập nhật thông báo không tồn tại")
    void testUpdateNotification_NotFound_ThrowsException() {
        when(notificationRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> notificationService.update(99L, validRequest)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy thông báo có id: 99"));
        verify(notificationRepository, never()).save(any());
    }

    @Test
    @DisplayName("Đánh dấu đã đọc: ghi nhận thời điểm đọc")
    void testMarkAsRead_Success() {
        Notification existing = buildNotification(50L, null);

        when(notificationRepository.findById(50L)).thenReturn(Optional.of(existing));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> invocation.getArgument(0));

        NotificationResponse response = notificationService.markAsRead(50L);

        assertNotNull(response.getReadAt());
        verify(notificationRepository, times(1)).save(existing);
    }

    @Test
    @DisplayName("Đánh dấu đã đọc: giữ nguyên thời điểm đọc nếu đã đọc trước đó")
    void testMarkAsRead_AlreadyRead_KeepsReadAt() {
        LocalDateTime firstRead = LocalDateTime.of(2026, 10, 1, 8, 0, 0);
        Notification existing = buildNotification(50L, firstRead);

        when(notificationRepository.findById(50L)).thenReturn(Optional.of(existing));

        NotificationResponse response = notificationService.markAsRead(50L);

        assertEquals(firstRead, response.getReadAt());
        verify(notificationRepository, never()).save(any());
    }

    @Test
    @DisplayName("Đánh dấu tất cả đã đọc cho một người dùng")
    void testMarkAllAsRead_Success() {
        Notification n1 = buildNotification(1L, null);
        Notification n2 = buildNotification(2L, null);

        when(notificationRepository.findUnreadByUserId(1L)).thenReturn(List.of(n1, n2));

        int updated = notificationService.markAllAsRead(1L);

        assertEquals(2, updated);
        assertNotNull(n1.getReadAt());
        assertNotNull(n2.getReadAt());
        verify(notificationRepository, times(1)).saveAll(List.of(n1, n2));
    }

    @Test
    @DisplayName("Đánh dấu tất cả đã đọc: không có thông báo chưa đọc thì trả về 0")
    void testMarkAllAsRead_NothingUnread() {
        when(notificationRepository.findUnreadByUserId(1L)).thenReturn(List.of());

        int updated = notificationService.markAllAsRead(1L);

        assertEquals(0, updated);
        verify(notificationRepository, never()).saveAll(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi tìm theo người nhận hoặc loại với tham số không hợp lệ")
    void testFind_InvalidParams_ThrowsException() {
        IllegalArgumentException ex1 = assertThrows(
                IllegalArgumentException.class,
                () -> notificationService.findByUserId(null)
        );
        assertTrue(ex1.getMessage().contains("Mã người nhận không hợp lệ"));

        IllegalArgumentException ex2 = assertThrows(
                IllegalArgumentException.class,
                () -> notificationService.countUnreadByUserId(-5L)
        );
        assertTrue(ex2.getMessage().contains("Mã người nhận không hợp lệ"));

        IllegalArgumentException ex3 = assertThrows(
                IllegalArgumentException.class,
                () -> notificationService.findByType("promotion")
        );
        assertTrue(ex3.getMessage().contains("Loại thông báo không hợp lệ"));

        verify(notificationRepository, never()).findByUserId(any());
    }

    @Test
    @DisplayName("Xóa thông báo không tồn tại ném ngoại lệ")
    void testDeleteNotification_NotFound_ThrowsException() {
        when(notificationRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> notificationService.delete(99L)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy thông báo có id: 99"));
        verify(notificationRepository, never()).delete(any());
    }
}
