package com.aidims.aidimsbackend.controller;

import com.aidims.aidimsbackend.entity.Patient;
import com.aidims.aidimsbackend.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;

    @GetMapping
    @CrossOrigin(origins = "http://localhost:3000")
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
}