package com.aidims.aidimsbackend.service;

import com.aidims.aidimsbackend.dto.LoginRequest;
import com.aidims.aidimsbackend.dto.LoginResponse;
import com.aidims.aidimsbackend.entity.User;
import com.aidims.aidimsbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public LoginResponse login(LoginRequest request) {
        try {
            Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
            
            if (userOpt.isEmpty()) {
                return LoginResponse.error("Tài khoản không tồn tại");
            }
            
            User user = userOpt.get();
            
            // So sánh mật khẩu plain text
            if (!user.getPassword().equals(request.getPassword())) {
                return LoginResponse.error("Mật khẩu không chính xác");
            }
            
            if (!user.isActive()) {
                return LoginResponse.error("Tài khoản đã bị vô hiệu hóa");
            }
            
            // Tạo response
            Map<String, Object> userData = new HashMap<>();
            userData.put("userId", user.getUserId());
            userData.put("username", user.getUsername());
            userData.put("role", user.getRole().getRoleName());
            userData.put("fullName", user.getFullName());
            userData.put("email", user.getEmail());
            userData.put("phone", user.getPhone());
            
            return LoginResponse.success(userData);
            
        } catch (Exception e) {
            return LoginResponse.error("Lỗi hệ thống: " + e.getMessage());
        }
    }
}