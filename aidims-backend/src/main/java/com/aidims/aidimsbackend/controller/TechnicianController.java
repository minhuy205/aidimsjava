package com.aidims.aidimsbackend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/technician")
@CrossOrigin(origins = "*")
public class TechnicianController {

    @GetMapping("/dashboard")
    public String getDashboard() {
        return "Trang kỹ thuật viên";
    }
}