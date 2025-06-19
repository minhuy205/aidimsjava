package com.aidims.aidimsbackend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aidims.aidimsbackend.entity.Patient;
import com.aidims.aidimsbackend.entity.SymptomRecord;
import com.aidims.aidimsbackend.service.PatientService;
import com.aidims.aidimsbackend.service.SymptomRecordService;

@RestController
@RequestMapping("/api/symptom-record")
@CrossOrigin(origins = "*")
public class SymptomRecordController {

    @Autowired
    private SymptomRecordService symptomRecordService;
    @Autowired
    private PatientService patientService;

    /**
     * Lấy tất cả triệu chứng kèm thông tin bệnh nhân
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllSymptoms() {
        try {
            List<SymptomRecord> symptoms = symptomRecordService.getAllSymptoms();
            // Lọc chỉ lấy bản ghi hợp lệ (mainSymptom khác null/rỗng)
            List<SymptomRecord> validSymptoms = symptoms.stream()
                .filter(s -> s.getMainSymptom() != null && !s.getMainSymptom().trim().isEmpty())
                .collect(Collectors.toList());
            List<Patient> patients = patientService.getAllPatients();
            Map<Long, Patient> patientMap = patients.stream().collect(Collectors.toMap(p -> p.getPatient_id(), p -> p));
            List<Map<String, Object>> result = validSymptoms.stream().map(symptom -> {
                Map<String, Object> symptomData = new HashMap<>();
                Patient patient = patientMap.get(symptom.getPatientId());
                symptomData.put("id", symptom.getId());
                symptomData.put("patient_id", symptom.getPatientId());
                symptomData.put("main_symptom", symptom.getMainSymptom());
                symptomData.put("detailed_symptoms", symptom.getDetailedSymptoms());
                symptomData.put("other_symptoms", symptom.getOtherSymptoms());
                symptomData.put("created_at", symptom.getCreatedAt());
                if (patient != null) {
                    symptomData.put("patient_code", patient.getPatient_code());
                    symptomData.put("patient_name", patient.getFull_name());
                    symptomData.put("patient_phone", patient.getPhone());
                    symptomData.put("patient_age", patient.getAge());
                } else {
                    symptomData.put("patient_code", "BN" + symptom.getPatientId());
                    symptomData.put("patient_name", "Không xác định");
                    symptomData.put("patient_phone", "N/A");
                    symptomData.put("patient_age", "N/A");
                }
                return symptomData;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Error getting all symptoms: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Lấy tất cả triệu chứng theo patient_id
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Map<String, Object>>> getSymptomsByPatientId(@PathVariable Long patientId) {
        try {
            List<SymptomRecord> symptoms = symptomRecordService.getSymptomsByPatientId(patientId);
            // Lọc chỉ lấy bản ghi hợp lệ (mainSymptom khác null/rỗng)
            List<SymptomRecord> validSymptoms = symptoms.stream()
                .filter(s -> s.getMainSymptom() != null && !s.getMainSymptom().trim().isEmpty())
                .collect(Collectors.toList());
            Patient patient = patientService.getPatientById(patientId);
            List<Map<String, Object>> result = validSymptoms.stream().map(symptom -> {
                Map<String, Object> symptomData = new HashMap<>();
                symptomData.put("id", symptom.getId());
                symptomData.put("patient_id", symptom.getPatientId());
                symptomData.put("main_symptom", symptom.getMainSymptom());
                symptomData.put("detailed_symptoms", symptom.getDetailedSymptoms());
                symptomData.put("other_symptoms", symptom.getOtherSymptoms());
                symptomData.put("created_at", symptom.getCreatedAt());
                if (patient != null) {
                    symptomData.put("patient_code", patient.getPatient_code());
                    symptomData.put("patient_name", patient.getFull_name());
                    symptomData.put("patient_phone", patient.getPhone());
                    symptomData.put("patient_age", patient.getAge());
                } else {
                    symptomData.put("patient_code", "BN" + symptom.getPatientId());
                    symptomData.put("patient_name", "Không xác định");
                    symptomData.put("patient_phone", "N/A");
                    symptomData.put("patient_age", "N/A");
                }
                return symptomData;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Error getting symptom records for patient " + patientId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Tạo triệu chứng từ form React
     */
    @PostMapping("/create")
    public ResponseEntity<?> createSymptomRecord(@RequestBody Map<String, Object> requestData) {
        try {
            Long patientId = null;
            try {
                patientId = Long.valueOf(requestData.get("patient_id").toString());
            } catch (Exception ex) {
                return ResponseEntity.badRequest().body("Thiếu hoặc sai thông tin bệnh nhân!");
            }
            String chiefComplaint = (String) requestData.get("chief_complaint");
            String severityLevel = (String) requestData.get("severity_level");
            String priorityLevel = (String) requestData.get("priority_level");
            String onsetTime = (String) requestData.get("onset_time");
            String duration = (String) requestData.get("duration");
            Integer painScale = requestData.get("pain_scale") != null && !requestData.get("pain_scale").toString().isEmpty() ? Integer.valueOf(requestData.get("pain_scale").toString()) : null;
            String additionalNotes = (String) requestData.get("additional_notes");
            String recordedBy = (String) requestData.get("recorded_by");

            // Kiểm tra trường bắt buộc
            if (patientId == null || chiefComplaint == null || chiefComplaint.trim().isEmpty() ||
                severityLevel == null || severityLevel.trim().isEmpty() ||
                priorityLevel == null || priorityLevel.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Thiếu thông tin bắt buộc!");
            }
            // Không kiểm tra trùng lặp để test lưu triệu chứng
            SymptomRecord symptom = new SymptomRecord();
            symptom.setPatientId(patientId);
            symptom.setMainSymptom(chiefComplaint);
            symptom.setDetailedSymptoms("Severity: " + severityLevel +
                    "\nOnset: " + (onsetTime != null ? onsetTime : "Không rõ") +
                    "\nDuration: " + (duration != null ? duration : "Không rõ") +
                    "\nPain Scale: " + (painScale != null ? painScale : "Không rõ"));
            symptom.setOtherSymptoms("Priority: " + priorityLevel +
                    "\nAdditional Notes: " + (additionalNotes != null ? additionalNotes : "") +
                    "\nRecorded By: " + (recordedBy != null ? recordedBy : ""));

            SymptomRecord savedSymptom = symptomRecordService.saveSymptom(symptom);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedSymptom);
        } catch (NumberFormatException e) {
            System.err.println("Error parsing numeric values: " + e.getMessage());
            return ResponseEntity.badRequest().body("Sai định dạng dữ liệu!");
        } catch (Exception e) {
            System.err.println("Error creating symptom record: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống!\n" + e.getMessage());
        }
    }

    /**
     * Xóa triệu chứng
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSymptom(@PathVariable Long id) {
        try {
            SymptomRecord symptom = symptomRecordService.getSymptomById(id);
            if (symptom == null) {
                return ResponseEntity.notFound().build();
            }
            symptomRecordService.deleteSymptom(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error deleting symptom record: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
