package com.aidims.aidimsbackend.repository;

import com.aidims.aidimsbackend.entity.DiagnosticReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface DiagnosticReportRepository extends JpaRepository<DiagnosticReport, Integer> {


    Optional<DiagnosticReport> findByReportCode(String reportCode);


    List<DiagnosticReport> findByRadiologistId(Integer radiologistId);


    List<DiagnosticReport> findByStatus(DiagnosticReport.ReportStatus status);


    List<DiagnosticReport> findByReportType(DiagnosticReport.ReportType reportType);


    List<DiagnosticReport> findByResultId(Integer resultId);


    @Query("SELECT dr FROM DiagnosticReport dr WHERE dr.createdAt BETWEEN :startDate AND :endDate ORDER BY dr.createdAt DESC")
    List<DiagnosticReport> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate,
                                                  @Param("endDate") LocalDateTime endDate);


    List<DiagnosticReport> findByRadiologistIdAndStatus(Integer radiologistId, DiagnosticReport.ReportStatus status);


    long countByStatus(DiagnosticReport.ReportStatus status);


    long countByRadiologistId(Integer radiologistId);


    @Query("SELECT dr FROM DiagnosticReport dr ORDER BY dr.createdAt DESC LIMIT :limit")
    List<DiagnosticReport> findLatestReports(@Param("limit") int limit);


    boolean existsByReportCode(String reportCode);


    @Query("SELECT dr FROM DiagnosticReport dr WHERE dr.status = 'BanNhap' ORDER BY dr.dictatedAt ASC")
    List<DiagnosticReport> findPendingReports();


    @Query("SELECT dr FROM DiagnosticReport dr WHERE dr.status = 'HoanThanh' AND dr.finalizedAt BETWEEN :startDate AND :endDate ORDER BY dr.finalizedAt DESC")
    List<DiagnosticReport> findCompletedReportsInDateRange(@Param("startDate") LocalDateTime startDate,
                                                           @Param("endDate") LocalDateTime endDate);
}