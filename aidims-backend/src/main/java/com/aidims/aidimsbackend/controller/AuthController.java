package com.aidims.aidimsbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aidims.aidimsbackend.dto.LoginRequest;
import com.aidims.aidimsbackend.dto.LoginResponse;
import com.aidims.aidimsbackend.service.AuthService;
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login/{role}")
    public LoginResponse login(@PathVariable String role, @RequestBody LoginRequest request) {
        // Role is already in the path, no need to set it in request
        return authService.login(request);
    }
}