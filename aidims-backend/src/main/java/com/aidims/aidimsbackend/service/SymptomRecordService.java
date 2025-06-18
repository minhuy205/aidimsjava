// SymptomRecordService.java
package com.aidims.aidimsbackend.service;

import com.aidims.aidimsbackend.entity.SymptomRecord;
import com.aidims.aidimsbackend.repository.SymptomRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SymptomRecordService {

    @Autowired
    private SymptomRecordRepository symptomRecordRepository;

    /**
     * Lấy tất cả triệu chứng theo patient_id
     */
    public List<SymptomRecord> getSymptomsByPatientId(Long patientId) {
        return symptomRecordRepository.findByPatientId(patientId);
    }

    /**
     * Lấy triệu chứng theo ID
     */
    public SymptomRecord getSymptomById(Long id) {
        Optional<SymptomRecord> symptom = symptomRecordRepository.findById(id);
        return symptom.orElse(null);
    }

    /**
     * Lưu hoặc cập nhật triệu chứng
     */
    public SymptomRecord saveSymptom(SymptomRecord symptom) {
        return symptomRecordRepository.save(symptom);
    }

    /**
     * Xóa triệu chứng theo ID
     */
    public void deleteSymptom(Long id) {
        symptomRecordRepository.deleteById(id);
    }

    /**
     * Lấy triệu chứng mới nhất của bệnh nhân
     */
    public List<SymptomRecord> getLatestSymptomsByPatientId(Long patientId) {
        return symptomRecordRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    /**
     * Kiểm tra bệnh nhân có triệu chứng hay không
     */
    public boolean hasSymptoms(Long patientId) {
        return symptomRecordRepository.existsByPatientId(patientId);
    }

    /**
     * Đếm số lượng triệu chứng của bệnh nhân
     */
    public long countSymptomsByPatientId(Long patientId) {
        return symptomRecordRepository.countByPatientId(patientId);
    }

    /**
     * Tạo triệu chứng mới cho bệnh nhân
     */
    public SymptomRecord createSymptomForPatient(Long patientId, String mainSymptom,
                                                 String detailedSymptoms, String otherSymptoms) {
        SymptomRecord symptom = new SymptomRecord();
        symptom.setPatientId(patientId);
        symptom.setMainSymptom(mainSymptom != null ? mainSymptom : "");
        symptom.setDetailedSymptoms(detailedSymptoms);
        symptom.setOtherSymptoms(otherSymptoms);

        return symptomRecordRepository.save(symptom);
    }
}