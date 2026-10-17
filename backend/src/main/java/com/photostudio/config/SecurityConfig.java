package com.photostudio.config;

import com.photostudio.security.DatabaseUserDetailsService;
import com.photostudio.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final DatabaseUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthFilter;

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
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Tắt CSRF vì REST API Stateless không dùng Cookie Session
                .csrf(csrf -> csrf.disable())

                // 2. Tắt HTTP Basic và Form Login (chuẩn JWT Stateless theo Huongdan2)
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(formLogin -> formLogin.disable())

                // 3. Đặt Session là STATELESS (không lưu session trên server)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4. Xử lý lỗi xác thực và phân quyền trả về đúng chuẩn JSON 401 / 403
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"" + authException.getMessage() + "\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"status\":403,\"error\":\"Forbidden\",\"message\":\"" + accessDeniedException.getMessage() + "\"}");
                        })
                )

                // 5. Gắn AuthenticationProvider sử dụng DatabaseUserDetailsService và BCrypt
                .authenticationProvider(authenticationProvider())

                // 6. Cấu hình phân quyền chi tiết cho các endpoint
                .authorizeHttpRequests(auth -> auth
                        // Cho phép truy cập công khai các API xác thực: Login, Register, Logout
                        .requestMatchers(HttpMethod.POST, "/api/auth/**", "/api/users/login", "/api/users/register", "/api/users/logout").permitAll()

                        // Cho phép xem thiết bị và phụ kiện công khai không cần token (GET /api/equipments và GET /api/products)
                        .requestMatchers(HttpMethod.GET, "/api/equipments/**", "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/accessories/**").permitAll()

                        // Xem danh sách người dùng: Yêu cầu đăng nhập tài khoản có quyền USER hoặc ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/users/**").hasAnyRole("USER", "ADMIN")

                        // Thêm/sửa/xóa phụ kiện: Chỉ ADMIN có quyền
                        .requestMatchers(HttpMethod.POST, "/api/accessories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/accessories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/accessories/**").hasRole("ADMIN")

                        // Thêm/sửa/xóa thiết bị (POST /api/products hoặc POST /api/equipments): Chỉ ADMIN có quyền
                        // Ca J06: USER gửi request -> 403 Forbidden; ADMIN gửi request -> 201 Created
                        .requestMatchers(HttpMethod.POST, "/api/equipments/**", "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/equipments/**", "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/equipments/**", "/api/products/**").hasRole("ADMIN")

                        // Các API khác
                        .anyRequest().permitAll()
                )

                // 7. Thêm JwtAuthenticationFilter trước UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
