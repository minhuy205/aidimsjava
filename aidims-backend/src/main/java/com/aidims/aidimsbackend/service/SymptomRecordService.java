package com.aidims.aidimsbackend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aidims.aidimsbackend.entity.SymptomRecord;
import com.aidims.aidimsbackend.repository.SymptomRecordRepository;

@Service
public class SymptomRecordService {

    @Autowired
    private SymptomRecordRepository symptomRecordRepository;

    public List<SymptomRecord> getAllSymptoms() {
        return symptomRecordRepository.findAll();
    }

    public List<SymptomRecord> getSymptomsByPatientId(Long patientId) {
        return symptomRecordRepository.findByPatientId(patientId);
    }

    public SymptomRecord getSymptomById(Long id) {
        Optional<SymptomRecord> symptom = symptomRecordRepository.findById(id);
        return symptom.orElse(null);
    }

    public SymptomRecord saveSymptom(SymptomRecord symptom) {
        return symptomRecordRepository.save(symptom);
    }

    public void deleteSymptom(Long id) {
        symptomRecordRepository.deleteById(id);
    }

    public List<SymptomRecord> getLatestSymptomsByPatientId(Long patientId) {
        return symptomRecordRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    public boolean hasSymptoms(Long patientId) {
        return symptomRecordRepository.existsByPatientId(patientId);
    }

    public long countSymptomsByPatientId(Long patientId) {
        return symptomRecordRepository.countByPatientId(patientId);
    }

    public SymptomRecord createSymptomForPatient(Long patientId, String mainSymptom,
                                               String detailedSymptoms, String otherSymptoms) {
        SymptomRecord symptom = new SymptomRecord();
        symptom.setPatientId(patientId);
        symptom.setMainSymptom(mainSymptom != null ? mainSymptom : "");
        symptom.setDetailedSymptoms(detailedSymptoms);
        symptom.setOtherSymptoms(otherSymptoms);
        return symptomRecordRepository.save(symptom);
    }

    public boolean isRecentDuplicate(Long patientId, String mainSymptom) {
        return symptomRecordRepository.existsRecentDuplicate(patientId, mainSymptom);
    }
}