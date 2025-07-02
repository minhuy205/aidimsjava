package com.aidims.aidimsbackend.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/receptionist/**",
                                "/api/symptom-record/**",
                                "/api/diagnostic-reports/**",
                                "/api/request-photo/**",
                                "/api/chat/**",
                                "/api/imaging-types/**",
                                "/api/dicom-import/**",
                                "/api/dicom-viewer/**",                    // ✅ THÊM DÒNG NÀY
                                "/api/verify-image/dicom-imports",         // Cho phép truy cập endpoint lấy ảnh import
                                "/api/verify-image/save"                   // Thêm dòng này để cho phép lưu kiểm tra hình ảnh
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .csrf(csrf -> csrf.disable())
                .httpBasic(httpBasic -> httpBasic.disable());

        System.out.println("✅ SecurityConfig: DICOM Viewer endpoints permitted");
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

        System.out.println("✅ CORS configured for DICOM Viewer");
        return source;
    }
}