package com.aidims.aidimsbackend.service;

import java.sql.Timestamp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aidims.aidimsbackend.entity.DicomImport;
import com.aidims.aidimsbackend.repository.DicomImportRepository;

@Service
public class DicomImportService {
    @Autowired
    private DicomImportRepository dicomImportRepository;

    public DicomImport saveDicomImport(DicomImport dicomImport) {
        dicomImport.setImportDate(new Timestamp(System.currentTimeMillis()));
        return dicomImportRepository.save(dicomImport);
    }
}
