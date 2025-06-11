package com.aidims.aidimsbackend.service;

import com.aidims.aidimsbackend.entity.DiagnosticReport;
import com.aidims.aidimsbackend.repository.DiagnosticReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

/**
 * Service class for DiagnosticReport business logic
 * Handles CRUD operations and business rules
 */
@Service
@Transactional
public class DiagnosticReportService {

    @Autowired
    private DiagnosticReportRepository diagnosticReportRepository;

    /**
     * Generate unique report code
     * Format: BC + YYYYMMDD + sequential number
     * @return unique report code
     */
    public String generateReportCode() {
        try {
            String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            long count = diagnosticReportRepository.count();
            return "BC" + dateStr + String.format("%03d", count + 1);
        } catch (Exception e) {
            // Fallback nếu database lỗi
            String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            return "BC" + dateStr + "001";
        }
    }

    /**
     * Create new diagnostic report
     * @param diagnosticReport report to create
     * @return saved DiagnosticReport
     */
    public DiagnosticReport createReport(DiagnosticReport diagnosticReport) {
        // Generate unique report code if not provided
        if (diagnosticReport.getReportCode() == null || diagnosticReport.getReportCode().isEmpty()) {
            diagnosticReport.setReportCode(generateReportCode());
        }

        // Validate report code uniqueness
        if (diagnosticReportRepository.existsByReportCode(diagnosticReport.getReportCode())) {
            throw new RuntimeException("Report code already exists: " + diagnosticReport.getReportCode());
        }

        // Set default values
        if (diagnosticReport.getStatus() == null) {
            if (diagnosticReport.getStatus() == null) {
                diagnosticReport.setStatus(DiagnosticReport.ReportStatus.BanNhap);
            }
        }

        if (diagnosticReport.getReportType() == null) {
            diagnosticReport.setReportType(DiagnosticReport.ReportType.SoBo);
        }

        return diagnosticReportRepository.save(diagnosticReport);
    }

    /**
     * Update existing diagnostic report
     * @param reportId ID of report to update
     * @param updatedReport updated report data
     * @return updated DiagnosticReport
     */
    public DiagnosticReport updateReport(Integer reportId, DiagnosticReport updatedReport) {
        Optional<DiagnosticReport> existingReport = diagnosticReportRepository.findById(reportId);

        if (existingReport.isEmpty()) {
            throw new RuntimeException("Diagnostic report not found with ID: " + reportId);
        }

        DiagnosticReport report = existingReport.get();

        // Update fields
        if (updatedReport.getFindings() != null) {
            report.setFindings(updatedReport.getFindings());
        }

        if (updatedReport.getImpression() != null) {
            report.setImpression(updatedReport.getImpression());
        }

        if (updatedReport.getRecommendations() != null) {
            report.setRecommendations(updatedReport.getRecommendations());
        }

        if (updatedReport.getReportType() != null) {
            report.setReportType(updatedReport.getReportType());
        }

        if (updatedReport.getStatus() != null) {
            report.setStatus(updatedReport.getStatus());

            // Set finalized date when status changes to completed
            if (updatedReport.getStatus() == DiagnosticReport.ReportStatus.HoanThanh &&
                    report.getFinalizedAt() == null) {
                report.setFinalizedAt(LocalDateTime.now());
            }
        }

        return diagnosticReportRepository.save(report);
    }

    /**
     * Get all diagnostic reports
     * @return List of all DiagnosticReport
     */
    @Transactional(readOnly = true)
    public List<DiagnosticReport> getAllReports() {
        return diagnosticReportRepository.findAll();
    }

    /**
     * Get diagnostic report by ID
     * @param reportId report ID
     * @return Optional DiagnosticReport
     */
    @Transactional(readOnly = true)
    public Optional<DiagnosticReport> getReportById(Integer reportId) {
        return diagnosticReportRepository.findById(reportId);
    }

    /**
     * Get diagnostic report by report code
     * @param reportCode unique report code
     * @return Optional DiagnosticReport
     */
    @Transactional(readOnly = true)
    public Optional<DiagnosticReport> getReportByCode(String reportCode) {
        return diagnosticReportRepository.findByReportCode(reportCode);
    }

    /**
     * Get reports by radiologist
     * @param radiologistId radiologist ID
     * @return List of DiagnosticReport
     */
    @Transactional(readOnly = true)
    public List<DiagnosticReport> getReportsByRadiologist(Integer radiologistId) {
        return diagnosticReportRepository.findByRadiologistId(radiologistId);
    }

    /**
     * Get reports by status
     * @param status report status
     * @return List of DiagnosticReport
     */
    @Transactional(readOnly = true)
    public List<DiagnosticReport> getReportsByStatus(DiagnosticReport.ReportStatus status) {
        return diagnosticReportRepository.findByStatus(status);
    }

    /**
     * Get pending reports (draft status)
     * @return List of pending DiagnosticReport
     */
    @Transactional(readOnly = true)
    public List<DiagnosticReport> getPendingReports() {
        return diagnosticReportRepository.findPendingReports();
    }

    /**
     * Get latest reports with limit
     * @param limit number of records to return
     * @return List of latest DiagnosticReport
     */
    @Transactional(readOnly = true)
    public List<DiagnosticReport> getLatestReports(int limit) {
        return diagnosticReportRepository.findLatestReports(limit);
    }

    /**
     * Delete diagnostic report
     * @param reportId report ID to delete
     */
    public void deleteReport(Integer reportId) {
        if (!diagnosticReportRepository.existsById(reportId)) {
            throw new RuntimeException("Diagnostic report not found with ID: " + reportId);
        }
        diagnosticReportRepository.deleteById(reportId);
    }

    /**
     * Finalize report (change status to completed)
     * @param reportId report ID to finalize
     * @return finalized DiagnosticReport
     */
    public DiagnosticReport finalizeReport(Integer reportId) {
        Optional<DiagnosticReport> reportOpt = diagnosticReportRepository.findById(reportId);

        if (reportOpt.isEmpty()) {
            throw new RuntimeException("Diagnostic report not found with ID: " + reportId);
        }

        DiagnosticReport report = reportOpt.get();
        report.setStatus(DiagnosticReport.ReportStatus.HoanThanh);
        report.setFinalizedAt(LocalDateTime.now());

        return diagnosticReportRepository.save(report);
    }

    /**
     * Get report statistics
     * @return statistics object
     */
    @Transactional(readOnly = true)
    public ReportStatistics getReportStatistics() {
        long totalReports = diagnosticReportRepository.count();
        long draftReports = diagnosticReportRepository.countByStatus(DiagnosticReport.ReportStatus.BanNhap);
        long completedReports = diagnosticReportRepository.countByStatus(DiagnosticReport.ReportStatus.HoanThanh);

        return new ReportStatistics(totalReports, draftReports, completedReports);
    }

    /**
     * Inner class for report statistics
     */
    public static class ReportStatistics {
        private long totalReports;
        private long draftReports;
        private long completedReports;

        public ReportStatistics(long totalReports, long draftReports, long completedReports) {
            this.totalReports = totalReports;
            this.draftReports = draftReports;
            this.completedReports = completedReports;
        }

        // Getters
        public long getTotalReports() { return totalReports; }
        public long getDraftReports() { return draftReports; }
        public long getCompletedReports() { return completedReports; }

        // Setters
        public void setTotalReports(long totalReports) { this.totalReports = totalReports; }
        public void setDraftReports(long draftReports) { this.draftReports = draftReports; }
        public void setCompletedReports(long completedReports) { this.completedReports = completedReports; }
    }
}