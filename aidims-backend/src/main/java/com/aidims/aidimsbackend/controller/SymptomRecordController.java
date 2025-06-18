// SymptomRecordController.java
package com.aidims.aidimsbackend.controller;

import com.aidims.aidimsbackend.entity.SymptomRecord;
import com.aidims.aidimsbackend.service.SymptomRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/symptom-record")
@CrossOrigin(origins = "*")
public class SymptomRecordController {

    @Autowired
    private SymptomRecordService symptomRecordService;

    /**
     * Lấy tất cả triệu chứng
     */
    @GetMapping
    public ResponseEntity<List<SymptomRecord>> getAllSymptoms() {
        try {
            List<SymptomRecord> symptoms = symptomRecordService.getAllSymptoms();
            return ResponseEntity.ok(symptoms);
        } catch (Exception e) {
            System.err.println("Error getting all symptoms: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Test endpoint
     */
    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testConnection() {
        System.out.println("SymptomRecord API test endpoint called");
        Map<String, String> response = Map.of(
                "status", "success",
                "message", "SymptomRecord API is working",
                "timestamp", java.time.LocalDateTime.now().toString()
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy tất cả triệu chứng theo patient_id
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<SymptomRecord>> getSymptomsByPatientId(@PathVariable Long patientId) {
        try {
            System.out.println("Fetching symptom records for patient ID: " + patientId);
            List<SymptomRecord> symptoms = symptomRecordService.getSymptomsByPatientId(patientId);
            System.out.println("Found " + symptoms.size() + " symptom records");
            return ResponseEntity.ok(symptoms);
        } catch (Exception e) {
            System.err.println("Error getting symptom records for patient " + patientId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Lấy triệu chứng mới nhất theo patient_id
     */
    @GetMapping("/patient/{patientId}/latest")
    public ResponseEntity<List<SymptomRecord>> getLatestSymptomsByPatientId(@PathVariable Long patientId) {
        try {
            List<SymptomRecord> symptoms = symptomRecordService.getLatestSymptomsByPatientId(patientId);
            return ResponseEntity.ok(symptoms);
        } catch (Exception e) {
            System.err.println("Error getting latest symptom records: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Lấy triệu chứng theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<SymptomRecord> getSymptomById(@PathVariable Long id) {
        try {
            SymptomRecord symptom = symptomRecordService.getSymptomById(id);
            if (symptom != null) {
                return ResponseEntity.ok(symptom);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error getting symptom record " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Tạo triệu chứng mới
     */
    @PostMapping
    public ResponseEntity<SymptomRecord> createSymptom(@RequestBody SymptomRecord symptom) {
        try {
            System.out.println("Creating symptom record for patient: " + symptom.getPatientId());

            if (symptom.getPatientId() == null) {
                return ResponseEntity.badRequest().build();
            }

            if (symptom.getMainSymptom() == null || symptom.getMainSymptom().trim().isEmpty()) {
                symptom.setMainSymptom("Chưa xác định");
            }

            SymptomRecord savedSymptom = symptomRecordService.saveSymptom(symptom);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedSymptom);
        } catch (Exception e) {
            System.err.println("Error creating symptom record: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Kiểm tra bệnh nhân có triệu chứng hay không
     */
    @GetMapping("/patient/{patientId}/exists")
    public ResponseEntity<Map<String, Object>> checkSymptomsExist(@PathVariable Long patientId) {
        try {
            boolean hasSymptoms = symptomRecordService.hasSymptoms(patientId);
            long count = symptomRecordService.countSymptomsByPatientId(patientId);

            Map<String, Object> response = Map.of(
                    "hasSymptoms", hasSymptoms,
                    "count", count,
                    "patientId", patientId
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error checking symptom records: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Tạo triệu chứng nhanh
     */
    @PostMapping("/quick")
    public ResponseEntity<SymptomRecord> createQuickSymptom(@RequestBody Map<String, Object> request) {
        try {
            Long patientId = Long.valueOf(request.get("patientId").toString());
            String mainSymptom = (String) request.get("mainSymptom");
            String detailedSymptoms = (String) request.get("detailedSymptoms");
            String otherSymptoms = (String) request.get("otherSymptoms");

            SymptomRecord symptom = symptomRecordService.createSymptomForPatient(
                    patientId, mainSymptom, detailedSymptoms, otherSymptoms
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(symptom);
        } catch (Exception e) {
            System.err.println("Error creating quick symptom record: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
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

    /**
     * Tạo triệu chứng từ form React
     */
    @PostMapping("/create")
    public ResponseEntity<SymptomRecord> createSymptomRecord(@RequestBody Map<String, Object> requestData) {
        try {
            Long patientId = Long.valueOf(requestData.get("patient_id").toString());
            String chiefComplaint = (String) requestData.get("chief_complaint");
            String severityLevel = (String) requestData.get("severity_level");
            String priorityLevel = (String) requestData.get("priority_level");
            String onsetTime = (String) requestData.get("onset_time");
            String duration = (String) requestData.get("duration");
            Integer painScale = requestData.get("pain_scale") != null ? Integer.valueOf(requestData.get("pain_scale").toString()) : null;
            String additionalNotes = (String) requestData.get("additional_notes");
            String recordedBy = (String) requestData.get("recorded_by");
            
            SymptomRecord symptom = new SymptomRecord();
            symptom.setPatientId(patientId);
            symptom.setMainSymptom(chiefComplaint);
            symptom.setDetailedSymptoms("Severity: " + severityLevel + 
                                      "\nOnset: " + onsetTime + 
                                      "\nDuration: " + duration + 
                                      "\nPain Scale: " + painScale);
            symptom.setOtherSymptoms("Priority: " + priorityLevel + 
                                   "\nAdditional Notes: " + additionalNotes + 
                                   "\nRecorded By: " + recordedBy);
            
            SymptomRecord savedSymptom = symptomRecordService.saveSymptom(symptom);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedSymptom);
        } catch (NumberFormatException e) {
            System.err.println("Error parsing numeric values: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("Error creating symptom record: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    

}
