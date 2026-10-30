package com.photostudio.config;

import com.photostudio.security.DatabaseUserDetailsService;
import com.photostudio.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final DatabaseUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(DatabaseUserDetailsService userDetailsService, JwtAuthenticationFilter jwtAuthFilter) {
        super();
        this.userDetailsService = userDetailsService;
        this.jwtAuthFilter = jwtAuthFilter;
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
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Cho phép các nguồn Frontend phổ biến trong môi trường phát triển
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://127.0.0.1:5173"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "X-Requested-With", "Origin"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Cho phép CORS và tắt CSRF vì REST API Stateless không dùng Cookie Session
                .cors(Customizer.withDefaults())
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

                        // Thùng rác thiết bị chỉ dành cho ADMIN.
                        .requestMatchers("/api/equipments/trash", "/api/equipments/trash/**", "/api/products/trash", "/api/products/trash/**").hasRole("ADMIN")
                        .requestMatchers("/api/backgrounds/trash", "/api/backgrounds/trash/**").hasRole("ADMIN")
                        .requestMatchers("/api/rooms/trash", "/api/rooms/trash/**").hasRole("ADMIN")
                        .requestMatchers("/api/clothes/trash", "/api/clothes/trash/**").hasRole("ADMIN")
                        .requestMatchers("/api/accessories/trash", "/api/accessories/trash/**").hasRole("ADMIN")
                        .requestMatchers("/api/categories/trash", "/api/categories/trash/**").hasRole("ADMIN")
                        .requestMatchers("/api/services/trash", "/api/services/trash/**").hasRole("ADMIN")
                        .requestMatchers("/api/packages/trash", "/api/packages/trash/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/reviews/*/reply").hasAnyRole("ADMIN", "EMPLOYEE")
                        .requestMatchers(HttpMethod.PATCH, "/api/employee-reviews/*/reply").hasAnyRole("ADMIN", "EMPLOYEE")

                        // Chỉ admin được tải ảnh lên và thay đổi bản ghi ảnh; ảnh đã lưu được đọc công khai.
                        .requestMatchers(HttpMethod.POST, "/api/uploads/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/images/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/images/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/images/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/images/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/uploads/**", "/api/images/**").permitAll()

                        // Cho phép xem thiết bị và phụ kiện công khai không cần token (GET /api/equipments và GET /api/products)
                        .requestMatchers(HttpMethod.GET, "/api/equipments/**", "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/accessories/**", "/api/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/backgrounds/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/rooms/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/clothes/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/clothes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/clothes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/clothes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/services/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/services/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/services/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/services/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/packages/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/packages/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/packages/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/packages/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/banners/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/banners/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/banners/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/banners/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/banners/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/rooms/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/rooms/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/rooms/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/backgrounds/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/backgrounds/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/backgrounds/**").hasRole("ADMIN")
                        .requestMatchers("/api/contacts", "/api/contacts/**").permitAll()

                        // Khóa/mở khóa tài khoản chỉ dành cho ADMIN; cấm xóa tài khoản qua API.
                        .requestMatchers(HttpMethod.PATCH, "/api/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/**").denyAll()
                        .requestMatchers(HttpMethod.GET, "/api/users/profile").hasAnyRole("USER", "ADMIN", "EMPLOYEE")
                        .requestMatchers(HttpMethod.PUT, "/api/users/profile").hasAnyRole("USER", "ADMIN", "EMPLOYEE")
                        .requestMatchers(HttpMethod.POST, "/api/users/change-password", "/api/users/profile/password").hasAnyRole("USER", "ADMIN", "EMPLOYEE")
                        .requestMatchers(HttpMethod.PUT, "/api/users/**").hasAnyRole("USER", "ADMIN", "EMPLOYEE")

                        // Danh sách và thông tin tài khoản khác chỉ admin được phép xem.
                        .requestMatchers(HttpMethod.GET, "/api/users/**").hasRole("ADMIN")

                        // Thêm/sửa/xóa phụ kiện: Chỉ ADMIN có quyền
                        .requestMatchers(HttpMethod.POST, "/api/accessories/**", "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/accessories/**", "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/accessories/**", "/api/categories/**").hasRole("ADMIN")

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
