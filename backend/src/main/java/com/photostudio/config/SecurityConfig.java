package com.photostudio.config;

import com.photostudio.security.DatabaseUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final DatabaseUserDetailsService userDetailsService;

    public SecurityConfig(DatabaseUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Tắt CSRF vì REST API được gọi trực tiếp qua Postman/Client, không dùng form Cookie truyền thống
                .csrf(csrf -> csrf.disable())

                // 2. Gắn AuthenticationProvider sử dụng DatabaseUserDetailsService và BCrypt
                .authenticationProvider(authenticationProvider())

                // 3. Cấu hình phân quyền chi tiết cho các endpoint
                .authorizeHttpRequests(auth -> auth
                        // Cho phép đăng ký tài khoản và đăng xuất không cần xác thực
                        .requestMatchers(HttpMethod.POST, "/api/users/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users/logout").permitAll()

                        // Cho phép xem thiết bị và phụ kiện công khai không cần đăng nhập (tương ứng GET /api/products)
                        .requestMatchers(HttpMethod.GET, "/api/equipments/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/accessories/**").permitAll()

                        // Xem danh sách người dùng: Yêu cầu đăng nhập tài khoản có quyền USER hoặc ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/users/**").hasAnyRole("USER", "ADMIN")

                        // Thêm/sửa/xóa phụ kiện: Chỉ ADMIN có quyền (tương ứng POST /api/categories)
                        .requestMatchers(HttpMethod.POST, "/api/accessories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/accessories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/accessories/**").hasRole("ADMIN")

                        // Thêm/sửa/xóa thiết bị: Chỉ ADMIN có quyền (tương ứng POST /api/products)
                        // Ca B07: USER gửi request -> 403 Forbidden
                        // Ca B08: ADMIN gửi request -> 201 Created
                        .requestMatchers(HttpMethod.POST, "/api/equipments/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/equipments/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/equipments/**").hasRole("ADMIN")

                        // Các API quản lý studio khác (bookings, rooms, packages...)
                        .anyRequest().permitAll()
                )

                // 4. Bật xác thực HTTP Basic
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
