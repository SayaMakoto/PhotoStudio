package com.photostudio.service;

import com.photostudio.dto.users.UserRequest;
import com.photostudio.dto.users.UserResponse;
import com.photostudio.model.users.User;
import com.photostudio.model.users.UserRole;
import com.photostudio.model.users.UserStatus;

import java.util.List;
import java.util.Optional;

public interface UserService {

    List<UserResponse> findAll();

    UserResponse findById(Long id);

    UserResponse findByUsername(String username);

    UserResponse findByEmail(String email);

    UserResponse create(UserRequest request);

    UserResponse register(UserRequest request);

    UserResponse update(Long id, UserRequest request);

    UserResponse updateStatus(Long id, String status);

    void delete(Long id);

    List<UserResponse> findByRole(String role);

    List<UserResponse> findByStatus(String status);

    List<UserResponse> searchByName(String name);

    // Phương thức làm việc trực tiếp với Entity
    List<User> getAllUsers();

    Optional<User> getUserById(Long id);

    Optional<User> getUserByUsername(String username);

    User createUser(User user);

    User updateUser(Long id, User userDetails);

    void deleteUser(Long id);

    List<User> getUsersByRole(UserRole role);

    List<User> getUsersByStatus(UserStatus status);
}