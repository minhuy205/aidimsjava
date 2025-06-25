package com.aidims.aidimsbackend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.aidims.aidimsbackend.entity.Doctor;
import com.aidims.aidimsbackend.service.ReceptionistService;

@RestController
@RequestMapping("/api/receptionist")
@CrossOrigin(origins = "*")
public class ReceptionistController {

    @Autowired
    private ReceptionistService receptionistService;

    @GetMapping("/dashboard")
    public String getDashboard() {
        return "Trang tiếp nhận viên";
    }

    @GetMapping("/doctor/{id}")
    public Doctor getDoctorById(@PathVariable Long id) {
        return receptionistService.getDoctorById(id);
    }
}