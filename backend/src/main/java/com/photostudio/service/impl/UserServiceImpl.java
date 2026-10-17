package com.photostudio.service.impl;

import com.photostudio.dto.users.UserRequest;
import com.photostudio.dto.users.UserResponse;
import com.photostudio.mapper.UserMapper;
import com.photostudio.model.users.User;
import com.photostudio.model.users.UserRole;
import com.photostudio.model.users.UserStatus;
import com.photostudio.repository.UserRepository;
import com.photostudio.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private User findEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng có id: " + id));
    }

    private void checkUniqueUsernameAndEmail(String username, String email, Long excludeId) {
        if (username != null && !username.isBlank()) {
            boolean usernameExists = excludeId == null
                    ? userRepository.existsByUsername(username)
                    : userRepository.existsByUsernameAndIdNot(username, excludeId);
            if (usernameExists) {
                throw new IllegalArgumentException("Tên đăng nhập đã tồn tại!");
            }
        }

        if (email != null && !email.isBlank()) {
            boolean emailExists = excludeId == null
                    ? userRepository.existsByEmail(email)
                    : userRepository.existsByEmailAndIdNot(email, excludeId);
            if (emailExists) {
                throw new IllegalArgumentException("Email đã được sử dụng!");
            }
        }
    }

    // --- DTO Service Methods ---

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return userRepository.findAll()
                .stream()
                .map(UserMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        return UserMapper.toResponse(findEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse findByUsername(String username) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Tên đăng nhập không được để trống");
        }
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng có tên đăng nhập: " + username));
        return UserMapper.toResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse findByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email không được để trống");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng có email: " + email));
        return UserMapper.toResponse(user);
    }

    @Override
    public UserResponse create(UserRequest request) {
        request.validate(true);
        checkUniqueUsernameAndEmail(request.getUsername(), request.getEmail(), null);

        User user = UserMapper.toEntity(request);
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        }
        User saved = userRepository.save(user);
        return UserMapper.toResponse(saved);
    }

    @Override
    public UserResponse register(UserRequest request) {
        return create(request);
    }

    @Override
    public UserResponse update(Long id, UserRequest request) {
        request.validate(false);
        User user = findEntity(id);

        checkUniqueUsernameAndEmail(request.getUsername(), request.getEmail(), id);

        UserMapper.updateEntity(request, user);
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        }
        User saved = userRepository.save(user);
        return UserMapper.toResponse(saved);
    }

    @Override
    public UserResponse updateStatus(Long id, String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Trạng thái tài khoản không được để trống");
        }

        UserStatus userStatus;
        try {
            userStatus = UserStatus.valueOf(status.trim().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Trạng thái tài khoản không hợp lệ. Hợp lệ: active, inactive, banned");
        }

        User user = findEntity(id);
        user.setStatus(userStatus);
        User saved = userRepository.save(user);
        return UserMapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        User user = findEntity(id);
        userRepository.delete(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> findByRole(String role) {
        if (role == null || role.isBlank()) {
            throw new IllegalArgumentException("Vai trò không được để trống");
        }

        UserRole userRole;
        try {
            // Hỗ trợ cả trường hợp "customer", "CUSTOMER", "Customer"
            userRole = UserRole.valueOf(capitalizeFirstLetter(role.trim()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Vai trò không hợp lệ. Hợp lệ: Customer, Employee, Admin");
        }

        return userRepository.findByRole(userRole)
                .stream()
                .map(UserMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> findByStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Trạng thái không được để trống");
        }

        UserStatus userStatus;
        try {
            userStatus = UserStatus.valueOf(status.trim().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Trạng thái tài khoản không hợp lệ. Hợp lệ: active, inactive, banned");
        }

        return userRepository.findByStatus(userStatus)
                .stream()
                .map(UserMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> searchByName(String name) {
        if (name == null || name.isBlank()) {
            return findAll();
        }
        return userRepository.findByFullnameContaining(name.trim())
                .stream()
                .map(UserMapper::toResponse)
                .toList();
    }

    // --- Entity-level Methods (Backward compatibility) ---

    @Override
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public User createUser(User user) {
        checkUniqueUsernameAndEmail(user.getUsername(), user.getEmail(), null);
        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, User userDetails) {
        User user = findEntity(id);
        checkUniqueUsernameAndEmail(userDetails.getUsername(), userDetails.getEmail(), id);

        if (userDetails.getUsername() != null && !userDetails.getUsername().isBlank()) {
            user.setUsername(userDetails.getUsername());
        }
        if (userDetails.getEmail() != null && !userDetails.getEmail().isBlank()) {
            user.setEmail(userDetails.getEmail());
        }
        if (userDetails.getPassword() != null && !userDetails.getPassword().isBlank()) {
            user.setPassword(userDetails.getPassword());
        }
        user.setFullname(userDetails.getFullname());
        user.setPhone(userDetails.getPhone());
        user.setAddress(userDetails.getAddress());
        user.setDateOfBirth(userDetails.getDateOfBirth());
        user.setGender(userDetails.getGender());
        user.setAvatar(userDetails.getAvatar());
        if (userDetails.getRole() != null) {
            user.setRole(userDetails.getRole());
        }
        if (userDetails.getStatus() != null) {
            user.setStatus(userDetails.getStatus());
        }

        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        User user = findEntity(id);
        userRepository.delete(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getUsersByStatus(UserStatus status) {
        return userRepository.findByStatus(status);
    }

    private String capitalizeFirstLetter(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }
}