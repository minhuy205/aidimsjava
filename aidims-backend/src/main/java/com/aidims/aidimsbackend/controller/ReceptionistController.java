package com.aidims.aidimsbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aidims.aidimsbackend.entity.Doctor;
import com.aidims.aidimsbackend.entity.Patient;
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

    @GetMapping("/patients/{id}")
    public Patient getPatientById(@PathVariable Long id) {
        Patient patient = receptionistService.getPatientById(id);
        if (patient == null) {
            System.out.println("Không tìm thấy bệnh nhân với id: " + id);
        }
        return patient;
    }
}