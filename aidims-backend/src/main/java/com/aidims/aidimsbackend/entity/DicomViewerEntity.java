package com.aidims.aidimsbackend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dicom_imports")
public class DicomViewerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "body_part")
    private String bodyPart;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "import_date")
    private LocalDateTime importDate;

    private String notes;

    @Column(name = "patient_code")
    private String patientCode;

    @Column(name = "performed_by")
    private String performedBy;

    private String status;

    @Column(name = "study_type")
    private String studyType;

    @Column(name = "technical_params")
    private String technicalParams;

    // Constructors
    public DicomViewerEntity() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBodyPart() { return bodyPart; }
    public void setBodyPart(String bodyPart) { this.bodyPart = bodyPart; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public LocalDateTime getImportDate() { return importDate; }
    public void setImportDate(LocalDateTime importDate) { this.importDate = importDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getPatientCode() { return patientCode; }
    public void setPatientCode(String patientCode) { this.patientCode = patientCode; }

    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getStudyType() { return studyType; }
    public void setStudyType(String studyType) { this.studyType = studyType; }

    public String getTechnicalParams() { return technicalParams; }
    public void setTechnicalParams(String technicalParams) { this.technicalParams = technicalParams; }
}