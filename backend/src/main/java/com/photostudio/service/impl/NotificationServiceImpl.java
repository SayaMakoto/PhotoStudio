package com.photostudio.service.impl;

import com.photostudio.dto.notifications.NotificationRequest;
import com.photostudio.dto.notifications.NotificationResponse;
import com.photostudio.mapper.NotificationMapper;
import com.photostudio.model.notifications.Notification;
import com.photostudio.model.notifications.NotificationType;
import com.photostudio.model.users.User;
import com.photostudio.repository.NotificationRepository;
import com.photostudio.repository.UserRepository;
import com.photostudio.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository repository;
    private final UserRepository userRepository;

    public NotificationServiceImpl(
            NotificationRepository repository,
            UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    private Notification findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông báo có id: " + id));
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng có id: " + userId));
    }

    private void checkUserId(Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Mã người nhận không hợp lệ");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(NotificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationResponse findById(Long id) {
        return NotificationMapper.toResponse(findEntity(id));
    }

    @Override
    public NotificationResponse create(NotificationRequest request) {
        request.validate();

        User user = findUser(request.getUserId());

        Notification notification = NotificationMapper.toEntity(request, user);
        Notification saved = repository.save(notification);
        return NotificationMapper.toResponse(saved);
    }

    @Override
    public NotificationResponse update(Long id, NotificationRequest request) {
        request.validate();

        Notification notification = findEntity(id);

        User user = findUser(request.getUserId());

        NotificationMapper.updateEntity(request, notification, user);
        Notification saved = repository.save(notification);
        return NotificationMapper.toResponse(saved);
    }

    @Override
    public NotificationResponse markAsRead(Long id) {
        Notification notification = findEntity(id);

        // Đã đọc rồi thì giữ nguyên thời điểm đọc đầu tiên
        if (notification.getReadAt() == null) {
            notification.setReadAt(LocalDateTime.now());
            notification = repository.save(notification);
        }
        return NotificationMapper.toResponse(notification);
    }

    @Override
    public int markAllAsRead(Long userId) {
        checkUserId(userId);

        List<Notification> unread = repository.findUnreadByUserId(userId);
        if (unread.isEmpty()) {
            return 0;
        }

        LocalDateTime now = LocalDateTime.now();
        for (Notification notification : unread) {
            notification.setReadAt(now);
        }
        repository.saveAll(unread);
        return unread.size();
    }

    @Override
    public void delete(Long id) {
        Notification notification = findEntity(id);
        repository.delete(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> findByUserId(Long userId) {
        checkUserId(userId);
        return repository.findByUserId(userId)
                .stream()
                .map(NotificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> findUnreadByUserId(Long userId) {
        checkUserId(userId);
        return repository.findUnreadByUserId(userId)
                .stream()
                .map(NotificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public long countUnreadByUserId(Long userId) {
        checkUserId(userId);
        return repository.countUnreadByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> findByType(String type) {
        if (type == null || type.isBlank()) {
            throw new IllegalArgumentException("Loại thông báo tìm kiếm không được để trống");
        }

        NotificationType notificationType;
        try {
            notificationType = NotificationType.valueOf(type.trim().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Loại thông báo không hợp lệ. Hợp lệ: booking, payment, employee_assignment, equipment, system");
        }

        return repository.findByType(notificationType)
                .stream()
                .map(NotificationMapper::toResponse)
                .toList();
    }
}
