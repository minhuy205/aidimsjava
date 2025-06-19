package com.aidims.aidimsbackend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.aidims.aidimsbackend.entity.DiagnosticReport;
import com.aidims.aidimsbackend.service.DiagnosticReportService;

/**
 * REST Controller for DiagnosticReport operations
 */
@RestController
@RequestMapping("/api/diagnostic-reports")
@CrossOrigin("*")

public class DiagnosticReportController {

    @Autowired
    private DiagnosticReportService diagnosticReportService;

    // Constructor to verify bean creation
    public DiagnosticReportController() {
        System.out.println("🏗️ DiagnosticReportController created!");
    }
    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> handleOptions() {
        return ResponseEntity.ok()
                .header("Access-Control-Allow-Origin", "")
                .header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
                .header("Access-Control-Allow-Headers", "")
                .build();
    }

    /**
     * Test endpoint
     */
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        System.out.println("📞 GET /test called");
        return ResponseEntity.ok("API is working!");
    }

    /**
     * Create new diagnostic report - EXPLICIT POST MAPPING
     */
    @PostMapping(value = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> createReport(@RequestBody DiagnosticReport diagnosticReport) {
        try {
            System.out.println("📝 POST / called - Received request to create report: " + diagnosticReport);

            DiagnosticReport savedReport = diagnosticReportService.createReport(diagnosticReport);

            System.out.println("✅ Report created successfully: " + savedReport.getReportCode());

            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                    true, "Báo cáo chẩn đoán đã được tạo thành công", savedReport
            ));
        } catch (Exception e) {
            System.err.println("❌ Error creating report: " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(
                    false, "Lỗi khi tạo báo cáo: " + e.getMessage(), null
            ));
        }
    }

    /**
     * Alternative POST endpoint for debugging
     */
    @PostMapping("/create")
    public ResponseEntity<?> createReportAlternative(@RequestBody DiagnosticReport diagnosticReport) {
        System.out.println("📝 POST /create called - Alternative endpoint");
        return createReport(diagnosticReport);
    }

    /**
     * Debug endpoint to test POST without data
     */
    @PostMapping("/test-post")  // Thay vì /debug
    public ResponseEntity<String> debugPost() {
        System.out.println("🐛 POST /test-post called");
        return ResponseEntity.ok("POST endpoint is working!");
    }

    /**
     * Get all diagnostic reports
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<DiagnosticReport>>> getAllReports() {
        try {
            List<DiagnosticReport> reports = diagnosticReportService.getAllReports();
            return ResponseEntity.ok(new ApiResponse<>(
                    true, "Lấy danh sách báo cáo thành công", reports
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(
                    false, "Lỗi khi lấy danh sách báo cáo: " + e.getMessage(), null
            ));
        }
    }

    /**
     * Get diagnostic report by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DiagnosticReport>> getReportById(@PathVariable Integer id) {
        try {
            Optional<DiagnosticReport> report = diagnosticReportService.getReportById(id);
            if (report.isPresent()) {
                return ResponseEntity.ok(new ApiResponse<>(
                        true, "Lấy báo cáo thành công", report.get()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                        false, "Không tìm thấy báo cáo với ID: " + id, null
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(
                    false, "Lỗi khi lấy báo cáo: " + e.getMessage(), null
            ));
        }
    }

    /**
     * Get report statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<DiagnosticReportService.ReportStatistics>> getReportStatistics() {
        try {
            DiagnosticReportService.ReportStatistics stats = diagnosticReportService.getReportStatistics();
            return ResponseEntity.ok(new ApiResponse<>(
                    true, "Lấy thống kê báo cáo thành công", stats
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(
                    false, "Lỗi khi lấy thống kê: " + e.getMessage(), null
            ));
        }
    }

    /**
     * Generate new report code
     */
    @GetMapping("/generate-code")
    public ResponseEntity<ApiResponse<String>> generateReportCode() {
        try {
            String reportCode = diagnosticReportService.generateReportCode();
            return ResponseEntity.ok(new ApiResponse<>(
                    true, "Tạo mã báo cáo thành công", reportCode
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(
                    false, "Lỗi khi tạo mã báo cáo: " + e.getMessage(), null
            ));
        }
    }

    /**
     * Generic API Response wrapper
     */
    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;

        public ApiResponse(boolean success, String message, T data) {
            this.success = success;
            this.message = message;
            this.data = data;
        }

        // Getters and Setters
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public T getData() { return data; }
        public void setData(T data) { this.data = data; }
    }
}