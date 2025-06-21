package com.aidims.aidimsbackend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aidims.aidimsbackend.entity.Assignment;
import com.aidims.aidimsbackend.entity.Doctor;
import com.aidims.aidimsbackend.entity.Patient;
import com.aidims.aidimsbackend.entity.Symptom;
import com.aidims.aidimsbackend.service.ReceptionistService;

@RestController
@RequestMapping("/api/receptionist")
@CrossOrigin(origins = "*")
public class AssignmentController {

    @Autowired
    private ReceptionistService receptionistService;

    @PostMapping("/patient")
    public ResponseEntity<Patient> createOrUpdatePatient(@RequestBody Patient patient) {
        Patient saved = receptionistService.createOrUpdatePatient(patient);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/symptom")
    public ResponseEntity<Symptom> recordSymptom(@RequestParam Long patientId, @RequestParam String description) {
        Symptom symptom = receptionistService.recordSymptom(patientId, description);
        return ResponseEntity.ok(symptom);
    }

    @PostMapping("/assign")
    public ResponseEntity<Assignment> assignDoctor(@RequestParam Long patientId, @RequestParam Long doctorId, @RequestParam String department) {
        Assignment assignment = receptionistService.assignDoctor(patientId, doctorId, department);
        return ResponseEntity.ok(assignment);
    }

    @GetMapping("/assignments")
    public ResponseEntity<List<Assignment>> getAllAssignments() {
        return ResponseEntity.ok(receptionistService.getAllAssignments());
    }
    
    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(receptionistService.getAllPatients());
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(receptionistService.getAllDoctors());
    }
}