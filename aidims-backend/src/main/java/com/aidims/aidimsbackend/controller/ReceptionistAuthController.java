package com.aidims.aidimsbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/receptionist/auth")
@CrossOrigin(origins = "*")
public class ReceptionistAuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> receptionistLogin(@RequestBody LoginRequest request) {
        request.setRole("receptionist");
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/validate")
    public ResponseEntity<String> validateReceptionistAccess() {
        return ResponseEntity.ok("Receptionist access validated");
    }
}
