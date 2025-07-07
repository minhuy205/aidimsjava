package com.aidims.aidimsbackend.dto;

public class DicomViewerDTO {
    private Long id;
    private String fullName; // Tạo từ patientCode
    private String fileName;
    private String description; // Mapping từ notes
    private String modality; // Mapping từ studyType
    private String dateTaken; // Mapping từ importDate
    private String patientCode;
    private String imageUrl; // URL để hiển thị ảnh
    private String dicomFilePath; // Đường dẫn file gốc
    private String bodyPart;
    private String status;
    private String performedBy;
    private Long fileSize;
    private String technicalParams;

    // Constructors
    public DicomViewerDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getModality() { return modality; }
    public void setModality(String modality) { this.modality = modality; }

    public String getDateTaken() { return dateTaken; }
    public void setDateTaken(String dateTaken) { this.dateTaken = dateTaken; }

    public String getPatientCode() { return patientCode; }
    public void setPatientCode(String patientCode) { this.patientCode = patientCode; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getDicomFilePath() { return dicomFilePath; }
    public void setDicomFilePath(String dicomFilePath) { this.dicomFilePath = dicomFilePath; }

    public String getBodyPart() { return bodyPart; }
    public void setBodyPart(String bodyPart) { this.bodyPart = bodyPart; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public String getTechnicalParams() { return technicalParams; }
    public void setTechnicalParams(String technicalParams) { this.technicalParams = technicalParams; }
}