package com.aidims.aidimsbackend.entity;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "dicom_imports")
public class DicomImport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "patient_code")
    private String patientCode;

    @Column(name = "study_type")
    private String studyType;

    @Column(name = "body_part")
    private String bodyPart;

    @Column(name = "technical_params", columnDefinition = "LONGTEXT")
    private String technicalParams;

    @Column(name = "notes")
    private String notes;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "status")
    private String status;

    @Column(name = "import_date")
    private Timestamp importDate;

    @Column(name = "performed_by")
    private String performedBy;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "patient_name")
    private String patientName;

    // Default constructor
    public DicomImport() {}

    // All-args constructor
    public DicomImport(Long id, String fileName, String patientCode, String studyType, String bodyPart, String technicalParams, String notes, Long fileSize, String status, Timestamp importDate, String performedBy, String filePath, String patientName) {
        this.id = id;
        this.fileName = fileName;
        this.patientCode = patientCode;
        this.studyType = studyType;
        this.bodyPart = bodyPart;
        this.technicalParams = technicalParams;
        this.notes = notes;
        this.fileSize = fileSize;
        this.status = status;
        this.importDate = importDate;
        this.performedBy = performedBy;
        this.filePath = filePath;
        this.patientName = patientName;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getPatientCode() { return patientCode; }
    public void setPatientCode(String patientCode) { this.patientCode = patientCode; }
    public String getStudyType() { return studyType; }
    public void setStudyType(String studyType) { this.studyType = studyType; }
    public String getBodyPart() { return bodyPart; }
    public void setBodyPart(String bodyPart) { this.bodyPart = bodyPart; }
    public String getTechnicalParams() { return technicalParams; }
    public void setTechnicalParams(String technicalParams) { this.technicalParams = technicalParams; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Timestamp getImportDate() { return importDate; }
    public void setImportDate(Timestamp importDate) { this.importDate = importDate; }
    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
}
