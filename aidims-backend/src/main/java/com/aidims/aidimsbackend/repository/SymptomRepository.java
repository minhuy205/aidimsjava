package com.aidims.aidimsbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aidims.aidimsbackend.entity.Symptom;

@Repository
public interface SymptomRepository extends JpaRepository<Symptom, Long> {
}