package com.aidims.aidimsbackend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aidims.aidimsbackend.entity.Assignment;
import com.aidims.aidimsbackend.entity.Doctor;
import com.aidims.aidimsbackend.entity.Patient;
import com.aidims.aidimsbackend.entity.Symptom;
import com.aidims.aidimsbackend.repository.AssignmentRepository;
import com.aidims.aidimsbackend.repository.DoctorRepository;
import com.aidims.aidimsbackend.repository.PatientRepository;
import com.aidims.aidimsbackend.repository.SymptomRepository;
@Service
public class ReceptionistService {
    @Autowired private PatientRepository patientRepo;
    @Autowired private SymptomRepository symptomRepo;
    @Autowired private AssignmentRepository assignmentRepo;
    @Autowired private DoctorRepository doctorRepo;

   

    public Symptom recordSymptom(Long patientId, String description) {
        Patient patient = patientRepo.findById(patientId).orElseThrow();
        Symptom symptom = new Symptom();
        symptom.setPatient(patient);
        symptom.setDescription(description);
        symptom.setRecordedAt(LocalDateTime.now());
        return symptomRepo.save(symptom);
    }

    public Assignment assignDoctor(Long patientId, Long doctorId, String department) {
        Patient patient = patientRepo.findById(patientId).orElseThrow();
        Doctor doctor = doctorRepo.findById(doctorId).orElseThrow();
        Assignment a = new Assignment();
        a.setPatient(patient);
        a.setDoctor(doctor);
        a.setDepartment(department);
        a.setAssignedAt(LocalDateTime.now());
        a.setStatus("Đang chờ");
        return assignmentRepo.save(a);
    }

    public List<Assignment> getAllAssignments() {
        return assignmentRepo.findAll();
    }
    public List<Patient> getAllPatients() {
    return patientRepo.findAll();
}
public Patient createOrUpdatePatient(Patient patient) {
    if (patient.getDate_of_birth() != null && !patient.getDate_of_birth().isEmpty()) {
        LocalDate dob = LocalDate.parse(patient.getDate_of_birth());
        int age = Period.between(dob, LocalDate.now()).getYears();
        patient.setAge(age);
    }
    return patientRepo.save(patient);
}
public List<Doctor> getAllDoctors() {
    return doctorRepo.findAll();
}
public List<Doctor> getDoctorsByDepartment(String department) {
    return doctorRepo.findAll().stream()
        .filter(d -> d.getDepartment() != null && d.getDepartment().equalsIgnoreCase(department))
        .toList();
}
public Doctor getDoctorById(Long id) {
    return doctorRepo.findById(id).orElseThrow();
}
}
