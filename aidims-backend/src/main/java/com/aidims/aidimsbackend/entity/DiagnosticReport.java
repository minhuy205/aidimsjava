package com.aidims.aidimsbackend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.annotation.JsonCreator;

import java.time.LocalDateTime;

/**
 * Entity class for diagnostic_reports table
 */
@Entity
@Table(name = "diagnostic_reports")
public class DiagnosticReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Integer reportId;

    @NotNull(message = "Result ID is required")
    @Column(name = "result_id", nullable = false)
    private Integer resultId;

    @NotBlank(message = "Report code is required")
    @Size(max = 20, message = "Report code must not exceed 20 characters")
    @Column(name = "report_code", nullable = false, unique = true, length = 20)
    private String reportCode;

    @NotBlank(message = "Findings are required")
    @Column(name = "findings", nullable = false, columnDefinition = "TEXT")
    private String findings;

    @NotBlank(message = "Impression is required")
    @Column(name = "impression", nullable = false, columnDefinition = "TEXT")
    private String impression;

    @Column(name = "recommendations", columnDefinition = "TEXT")
    private String recommendations;

    @NotNull(message = "Report type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "report_type", nullable = false)
    private ReportType reportType;

    @NotNull(message = "Radiologist ID is required")
    @Column(name = "radiologist_id", nullable = false)
    private Integer radiologistId;

    @NotNull(message = "Dictated at is required")
    @Column(name = "dictated_at", nullable = false)
    private LocalDateTime dictatedAt;

    @Column(name = "finalized_at")
    private LocalDateTime finalizedAt;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReportStatus status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "referring_doctor_name")
    private String referringDoctorName;

    @Column(name = "referring_doctor_specialty", length = 100)
    private String referringDoctorSpecialty;
    // Enum definitions - WORKING VERSION
    public enum ReportType {
        SoBo, ChinhThuc, CapCuu;

        @JsonValue
        public String getValue() {
            switch (this) {
                case SoBo: return "Sơ bộ";
                case ChinhThuc: return "Chính thức";
                case CapCuu: return "Cấp cứu";
                default: return "Sơ bộ";
            }
        }

        @JsonCreator
        public static ReportType fromValue(String value) {
            if (value == null) return SoBo;
            switch (value) {
                case "Sơ bộ":
                case "SoBo":
                    return SoBo;
                case "Chính thức":
                case "ChinhThuc":
                    return ChinhThuc;
                case "Cấp cứu":
                case "CapCuu":
                    return CapCuu;
                default:
                    return SoBo;
            }
        }
    }

    public enum ReportStatus {
        BanNhap, HoanThanh;

        @JsonValue
        public String getValue() {
            switch (this) {
                case BanNhap: return "Bản nháp";
                case HoanThanh: return "Hoàn thành";
                default: return "Bản nháp";
            }
        }

        @JsonCreator
        public static ReportStatus fromValue(String value) {
            if (value == null) return BanNhap;
            switch (value) {
                case "Bản nháp":
                case "BanNhap":
                    return BanNhap;
                case "Hoàn thành":
                case "HoanThanh":
                    return HoanThanh;
                default:
                    return BanNhap;
            }
        }
    }

    // Constructors
    public DiagnosticReport() {}

    public DiagnosticReport(Integer resultId, String reportCode, String findings,
                            String impression, String recommendations, ReportType reportType,
                            Integer radiologistId, ReportStatus status) {
        this.resultId = resultId;
        this.reportCode = reportCode;
        this.findings = findings;
        this.impression = impression;
        this.recommendations = recommendations;
        this.reportType = reportType;
        this.radiologistId = radiologistId;
        this.status = status;
        this.dictatedAt = LocalDateTime.now();
    }

    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (dictatedAt == null) {
            dictatedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Integer getReportId() {
        return reportId;
    }

    public void setReportId(Integer reportId) {
        this.reportId = reportId;
    }

    public Integer getResultId() {
        return resultId;
    }

    public void setResultId(Integer resultId) {
        this.resultId = resultId;
    }

    public String getReportCode() {
        return reportCode;
    }

    public void setReportCode(String reportCode) {
        this.reportCode = reportCode;
    }

    public String getFindings() {
        return findings;
    }

    public void setFindings(String findings) {
        this.findings = findings;
    }

    public String getImpression() {
        return impression;
    }

    public void setImpression(String impression) {
        this.impression = impression;
    }

    public String getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(String recommendations) {
        this.recommendations = recommendations;
    }

    public ReportType getReportType() {
        return reportType;
    }

    public void setReportType(ReportType reportType) {
        this.reportType = reportType;
    }

    public Integer getRadiologistId() {
        return radiologistId;
    }

    public void setRadiologistId(Integer radiologistId) {
        this.radiologistId = radiologistId;
    }

    public LocalDateTime getDictatedAt() {
        return dictatedAt;
    }

    public void setDictatedAt(LocalDateTime dictatedAt) {
        this.dictatedAt = dictatedAt;
    }

    public LocalDateTime getFinalizedAt() {
        return finalizedAt;
    }

    public void setFinalizedAt(LocalDateTime finalizedAt) {
        this.finalizedAt = finalizedAt;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getReferringDoctorName() {
        return referringDoctorName;
    }

    public void setReferringDoctorName(String referringDoctorName) {
        this.referringDoctorName = referringDoctorName;
    }

    public String getReferringDoctorSpecialty() {
        return referringDoctorSpecialty;
    }

    public void setReferringDoctorSpecialty(String referringDoctorSpecialty) {
        this.referringDoctorSpecialty = referringDoctorSpecialty;
    }

    @Override
    public String toString() {
        return "DiagnosticReport{" +
                "reportId=" + reportId +
                ", reportCode='" + reportCode + '\'' +
                ", findings='" + findings + '\'' +
                ", impression='" + impression + '\'' +
                ", reportType=" + reportType +
                ", status=" + status +
                ", createdAt=" + createdAt +
                '}';
    }
}