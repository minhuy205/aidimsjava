package com.aidims.aidimsbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aidims.aidimsbackend.entity.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
}