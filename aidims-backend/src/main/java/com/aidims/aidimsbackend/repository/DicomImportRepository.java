package com.aidims.aidimsbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aidims.aidimsbackend.entity.DicomImport;

@Repository
public interface DicomImportRepository extends JpaRepository<DicomImport, Long> {
}
