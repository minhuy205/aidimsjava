package com.aidims.aidimsbackend.controller;

import com.aidims.aidimsbackend.dto.LoginRequest;
import com.aidims.aidimsbackend.dto.LoginResponse;
import com.aidims.aidimsbackend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        // Validate input
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(LoginResponse.error("Tên đăng nhập không được để trống"));
        }
        
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(LoginResponse.error("Mật khẩu không được để trống"));
        }
        
        // Check password contains only letters and numbers
        if (!request.getPassword().matches("^[a-zA-Z0-9]*$")) {
            return ResponseEntity.badRequest().body(LoginResponse.error("Mật khẩu chỉ được chứa chữ cái và số"));
        }

        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}