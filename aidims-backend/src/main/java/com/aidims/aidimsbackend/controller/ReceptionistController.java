package com.aidims.aidimsbackend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/receptionist")
@CrossOrigin(origins = "*")
public class ReceptionistController {

    @GetMapping("/dashboard")
    public String getDashboard() {
        return "Trang tiếp nhận viên";
    }
}