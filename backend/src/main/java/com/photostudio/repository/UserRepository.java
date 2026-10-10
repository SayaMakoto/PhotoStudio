package com.photostudio.repository;

import com.photostudio.model.users.User;
import com.photostudio.model.users.UserStatus;
import com.photostudio.model.users.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find a user by their username (useful for login)
    Optional<User> findByUsername(String username);

    // Find a user by their email
    Optional<User> findByEmail(String email);

    // Check if a username or email already exists during registration
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    // Find users by role (e.g., get all Employees or Customers)
    List<User> findByRole(Role role);

    // Find users by status (e.g., find all active or banned users)
    List<User> findByStatus(UserStatus status);

}