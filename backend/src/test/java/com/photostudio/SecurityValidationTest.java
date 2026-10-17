package com.photostudio;

import com.photostudio.model.users.User;
import com.photostudio.model.users.UserRole;
import com.photostudio.model.users.UserStatus;
import com.photostudio.repository.UserRepository;
import com.photostudio.security.AppUser;
import com.photostudio.security.DatabaseUserDetailsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SecurityValidationTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DatabaseUserDetailsService userDetailsService;

    private User userCustomer;
    private User userAdmin;

    @BeforeEach
    void setUp() {
        userCustomer = new User();
        userCustomer.setId(1L);
        userCustomer.setUsername("user_2124110206");
        userCustomer.setEmail("user_2124110206@photostudio.com");
        userCustomer.setPassword("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcd7qaUfqWg6");
        userCustomer.setRole(UserRole.Customer);
        userCustomer.setStatus(UserStatus.active);

        userAdmin = new User();
        userAdmin.setId(2L);
        userAdmin.setUsername("admin_2124110206");
        userAdmin.setEmail("admin_2124110206@photostudio.com");
        userAdmin.setPassword("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcd7qaUfqWg6");
        userAdmin.setRole(UserRole.Admin);
        userAdmin.setStatus(UserStatus.active);
    }

    @Test
    @DisplayName("Tải thông tin người dùng thành công qua username")
    void testLoadUserByUsername_Success() {
        when(userRepository.findByUsername("user_2124110206")).thenReturn(Optional.of(userCustomer));

        UserDetails userDetails = userDetailsService.loadUserByUsername("user_2124110206");

        assertNotNull(userDetails);
        assertEquals("user_2124110206", userDetails.getUsername());
        assertEquals("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcd7qaUfqWg6", userDetails.getPassword());
        assertTrue(userDetails.isEnabled());
        assertTrue(userDetails.isAccountNonLocked());

        Set<String> authorities = userDetails.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .collect(Collectors.toSet());
        assertTrue(authorities.contains("ROLE_USER"));
        assertFalse(authorities.contains("ROLE_ADMIN"));
    }

    @Test
    @DisplayName("Tải thông tin ADMIN thành công với đầy đủ quyền ROLE_ADMIN và ROLE_USER")
    void testLoadUserByUsername_AdminSuccess() {
        when(userRepository.findByUsername("admin_2124110206")).thenReturn(Optional.of(userAdmin));

        UserDetails userDetails = userDetailsService.loadUserByUsername("admin_2124110206");

        assertNotNull(userDetails);
        assertEquals("admin_2124110206", userDetails.getUsername());

        Set<String> authorities = userDetails.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .collect(Collectors.toSet());
        assertTrue(authorities.contains("ROLE_ADMIN"));
        assertTrue(authorities.contains("ROLE_USER"));
    }

    @Test
    @DisplayName("Ném ngoại lệ UsernameNotFoundException khi không tìm thấy username")
    void testLoadUserByUsername_NotFound_ThrowsException() {
        when(userRepository.findByUsername("unknown_user")).thenReturn(Optional.empty());

        UsernameNotFoundException ex = assertThrows(
                UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername("unknown_user"));

        assertTrue(ex.getMessage().contains("Không tìm thấy người dùng với username: unknown_user"));
    }

    @Test
    @DisplayName("Kiểm tra trạng thái tài khoản banned thì isAccountNonLocked = false")
    void testAppUser_BannedStatus_Locked() {
        userCustomer.setStatus(UserStatus.banned);
        AppUser appUser = new AppUser(userCustomer);

        assertFalse(appUser.isAccountNonLocked());
        assertFalse(appUser.isEnabled());
    }

    @Test
    @DisplayName("Kiểm tra trạng thái tài khoản inactive thì isEnabled = false")
    void testAppUser_InactiveStatus_Disabled() {
        userCustomer.setStatus(UserStatus.inactive);
        AppUser appUser = new AppUser(userCustomer);

        assertTrue(appUser.isAccountNonLocked());
        assertFalse(appUser.isEnabled());
    }
}
