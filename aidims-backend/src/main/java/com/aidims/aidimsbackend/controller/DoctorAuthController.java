/* package com.aidims.aidimsbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aidims.aidimsbackend.dto.LoginRequest;
import com.aidims.aidimsbackend.dto.LoginResponse;

import com.aidims.aidimsbackend.service.AuthService;


@RestController
@RequestMapping("/api/doctor/auth")
@CrossOrigin(origins = "*")
public class DoctorAuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> doctorLogin(@RequestBody LoginRequest request) {
        request.setRole("doctor");
        LoginResponse response = authService.login(request, "receptionist");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/validate")
    public ResponseEntity<String> validateDoctorAccess() {
        return ResponseEntity.ok("Doctor access validated");
    }
}
 */