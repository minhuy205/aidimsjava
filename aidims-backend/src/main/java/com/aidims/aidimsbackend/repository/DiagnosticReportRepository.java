package com.aidims.aidimsbackend.repository;

import com.aidims.aidimsbackend.entity.DiagnosticReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for DiagnosticReport entity
 * Provides data access methods for diagnostic reports
 */
@Repository
public interface DiagnosticReportRepository extends JpaRepository<DiagnosticReport, Integer> {

    /**
     * Find diagnostic report by report code
     * @param reportCode unique report code
     * @return Optional DiagnosticReport
     */
    Optional<DiagnosticReport> findByReportCode(String reportCode);

    /**
     * Find all reports by radiologist ID
     * @param radiologistId ID of the radiologist
     * @return List of DiagnosticReport
     */
    List<DiagnosticReport> findByRadiologistId(Integer radiologistId);

    /**
     * Find all reports by status
     * @param status report status
     * @return List of DiagnosticReport
     */
    List<DiagnosticReport> findByStatus(DiagnosticReport.ReportStatus status);

    /**
     * Find all reports by report type
     * @param reportType type of report
     * @return List of DiagnosticReport
     */
    List<DiagnosticReport> findByReportType(DiagnosticReport.ReportType reportType);

    /**
     * Find reports by result ID
     * @param resultId imaging result ID
     * @return List of DiagnosticReport
     */
    List<DiagnosticReport> findByResultId(Integer resultId);

    /**
     * Find reports created between dates
     * @param startDate start date
     * @param endDate end date
     * @return List of DiagnosticReport
     */
    @Query("SELECT dr FROM DiagnosticReport dr WHERE dr.createdAt BETWEEN :startDate AND :endDate ORDER BY dr.createdAt DESC")
    List<DiagnosticReport> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate,
                                                  @Param("endDate") LocalDateTime endDate);

    /**
     * Find reports by radiologist and status
     * @param radiologistId ID of the radiologist
     * @param status report status
     * @return List of DiagnosticReport
     */
    List<DiagnosticReport> findByRadiologistIdAndStatus(Integer radiologistId, DiagnosticReport.ReportStatus status);

    /**
     * Count reports by status
     * @param status report status
     * @return count of reports
     */
    long countByStatus(DiagnosticReport.ReportStatus status);

    /**
     * Count reports by radiologist
     * @param radiologistId ID of the radiologist
     * @return count of reports
     */
    long countByRadiologistId(Integer radiologistId);

    /**
     * Find latest reports with limit
     * @param limit number of records to return
     * @return List of latest DiagnosticReport
     */
    @Query("SELECT dr FROM DiagnosticReport dr ORDER BY dr.createdAt DESC LIMIT :limit")
    List<DiagnosticReport> findLatestReports(@Param("limit") int limit);

    /**
     * Check if report code exists
     * @param reportCode report code to check
     * @return true if exists, false otherwise
     */
    boolean existsByReportCode(String reportCode);

    /**
     * Find reports pending finalization (status = 'Bản nháp')
     * @return List of pending DiagnosticReport
     */
    @Query("SELECT dr FROM DiagnosticReport dr WHERE dr.status = 'BanNhap' ORDER BY dr.dictatedAt ASC")
    List<DiagnosticReport> findPendingReports();

    /**
     * Find completed reports in date range
     * @param startDate start date
     * @param endDate end date
     * @return List of completed DiagnosticReport
     */
    @Query("SELECT dr FROM DiagnosticReport dr WHERE dr.status = 'HoanThanh' AND dr.finalizedAt BETWEEN :startDate AND :endDate ORDER BY dr.finalizedAt DESC")
    List<DiagnosticReport> findCompletedReportsInDateRange(@Param("startDate") LocalDateTime startDate,
                                                           @Param("endDate") LocalDateTime endDate);
}