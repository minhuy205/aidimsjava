package com.aidims.aidimsbackend.service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aidims.aidimsbackend.dto.LoginRequest;
import com.aidims.aidimsbackend.dto.LoginResponse;
import com.aidims.aidimsbackend.entity.User;
import com.aidims.aidimsbackend.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // Nếu mật khẩu chỉ là số đơn giản => không mã hóa
    public LoginResponse login(LoginRequest request) {
        try {
            Optional<User> userOpt = userRepository.findActiveUserByUsernameAndRole(
                request.getUsername(),
                request.getRole().toLowerCase()
            );

            if (userOpt.isEmpty()) {
                return LoginResponse.error("❌ Tài khoản không tồn tại hoặc bị khóa.");
            }

            User user = userOpt.get();

            // So sánh mật khẩu thường (không mã hóa)
            if (!user.getPassword_hash().equals(request.getPassword())) {
                return LoginResponse.error("❌ Mật khẩu không đúng.");
            }

            // Cập nhật thời gian đăng nhập gần nhất
            user.setLast_login(Timestamp.valueOf(LocalDateTime.now()));
            userRepository.save(user);

            Map<String, Object> result = new HashMap<>();
            result.put("username", user.getUsername());
            result.put("role", user.getRole().getName());

            return LoginResponse.success(result);

        } catch (Exception e) {
            return LoginResponse.error("Lỗi hệ thống: " + e.getMessage());
        }
    }

    // Tạo tài khoản mới (nếu có tính năng đăng ký)
    public User createUser(User user) {
        // Không mã hóa password (nếu dùng password số)
        return userRepository.save(user);
    }

    // Kiểm tra username đã tồn tại
    public boolean isUsernameExists(String username) {
        return userRepository.existsByUsername(username);
    }
}
