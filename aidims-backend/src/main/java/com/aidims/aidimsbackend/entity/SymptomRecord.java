// SymptomRecord.java - Entity mới riêng biệt
package com.aidims.aidimsbackend.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "symptom")
public class SymptomRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @Column(name = "main_symptom", nullable = false)
    private String mainSymptom;

    @Column(name = "detailed_symptoms", columnDefinition = "TEXT")
    private String detailedSymptoms;

    @Column(name = "other_symptoms", columnDefinition = "TEXT")
    private String otherSymptoms;

    @Column(name = "created_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    // Constructors
    public SymptomRecord() {}

    public SymptomRecord(Long patientId, String mainSymptom, String detailedSymptoms, String otherSymptoms) {
        this.patientId = patientId;
        this.mainSymptom = mainSymptom;
        this.detailedSymptoms = detailedSymptoms;
        this.otherSymptoms = otherSymptoms;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getMainSymptom() {
        return mainSymptom;
    }

    public void setMainSymptom(String mainSymptom) {
        this.mainSymptom = mainSymptom;
    }

    public String getDetailedSymptoms() {
        return detailedSymptoms;
    }

    public void setDetailedSymptoms(String detailedSymptoms) {
        this.detailedSymptoms = detailedSymptoms;
    }

    public String getOtherSymptoms() {
        return otherSymptoms;
    }

    public void setOtherSymptoms(String otherSymptoms) {
        this.otherSymptoms = otherSymptoms;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (mainSymptom == null || mainSymptom.trim().isEmpty()) {
            mainSymptom = "Chưa xác định";
        }
    }

    @Override
    public String toString() {
        return "SymptomRecord{" +
                "id=" + id +
                ", patientId=" + patientId +
                ", mainSymptom='" + mainSymptom + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}