package com.aidims.aidimsbackend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.sql.Timestamp;

@Entity
@Table(name = "imaging_results")
public class ImagingResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    private Long resultId;

    @Column(name = "request_id")
    private Long requestId;

    @Column(name = "dicom_file_path")
    private String dicomFilePath;

    @Column(name = "thumbnail_path")
    private String thumbnailPath;

    @Column(name = "performed_by")
    private Long performedBy;

    @Column(name = "performed_at")
    private Timestamp performedAt;

    @Column(name = "technical_parameters", columnDefinition = "LONGTEXT")
    private String technicalParameters;

    @Column(name = "image_quality")
    private String imageQuality;

    @Column(name = "radiologist_id")
    private Long radiologistId;

    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    // Getters and Setters

    public Long getResultId() { return resultId; }
    public void setResultId(Long resultId) { this.resultId = resultId; }

    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }

    public String getDicomFilePath() { return dicomFilePath; }
    public void setDicomFilePath(String dicomFilePath) { this.dicomFilePath = dicomFilePath; }

    public String getThumbnailPath() { return thumbnailPath; }
    public void setThumbnailPath(String thumbnailPath) { this.thumbnailPath = thumbnailPath; }

    public Long getPerformedBy() { return performedBy; }
    public void setPerformedBy(Long performedBy) { this.performedBy = performedBy; }

    public Timestamp getPerformedAt() { return performedAt; }
    public void setPerformedAt(Timestamp performedAt) { this.performedAt = performedAt; }

    public String getTechnicalParameters() { return technicalParameters; }
    public void setTechnicalParameters(String technicalParameters) { this.technicalParameters = technicalParameters; }

    public String getImageQuality() { return imageQuality; }
    public void setImageQuality(String imageQuality) { this.imageQuality = imageQuality; }

    public Long getRadiologistId() { return radiologistId; }
    public void setRadiologistId(Long radiologistId) { this.radiologistId = radiologistId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }
} 
