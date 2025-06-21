package com.aidims.aidimsbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // ✅ NEW SYNTAX: Sử dụng lambda thay vì deprecated methods
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Bật CORS với cấu hình riêng
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/receptionist/**",
                                "/api/symptom-record/**", // Cho phép public API ghi nhận triệu chứng
                                "/api/diagnostic-reports/**" // ✅ THÊM: Cho phép tất cả diagnostic reports endpoints
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .csrf(csrf -> csrf.disable()); // Tạm thời vô hiệu hóa CSRF cho API

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // ✅ CẢI THIỆN: Thêm nhiều origins cho development và production
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",    // React development
                "http://localhost:3001",    // Alternative React port
                "http://localhost:8080",    // Same origin requests
                "http://127.0.0.1:3000"     // Alternative localhost
        ));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // ✅ THÊM: Cache preflight requests for 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}