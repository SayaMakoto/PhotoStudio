package com.photostudio.service;

import com.photostudio.model.users.User;
import com.photostudio.model.users.Role;
import com.photostudio.model.users.UserStatus;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAllUsers();
    Optional<User> getUserById(Long id);
    Optional<User> getUserByUsername(String username);
    User createUser(User user);
    User updateUser(Long id, User userDetails);
    void deleteUser(Long id);
    List<User> getUsersByRole(Role role);
    List<User> getUsersByStatus(UserStatus status);
}