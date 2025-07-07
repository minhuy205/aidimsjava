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
@CrossOrigin(origins = "*",
        allowedHeaders = {"Content-Type", "Authorization", "X-Requested-With"},
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
        allowCredentials = "false")
public class DiagnosticReportController {

    @Autowired
    private DiagnosticReportService diagnosticReportService;

    // Constructor to verify bean creation
    public DiagnosticReportController() {
        System.out.println("🏗️ DiagnosticReportController created!");
    }

    /**
     * Handle preflight OPTIONS requests
     */
    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> handleOptions() {
        return ResponseEntity.ok()
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Requested-With")
                .header("Access-Control-Max-Age", "3600")
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

            // THÊM DEBUG LOG:
            System.out.println("🔍 DEBUG - Referring Doctor Name: " + diagnosticReport.getReferringDoctorName());
            System.out.println("🔍 DEBUG - Referring Doctor Specialty: " + diagnosticReport.getReferringDoctorSpecialty());

            DiagnosticReport savedReport = diagnosticReportService.createReport(diagnosticReport);

            System.out.println("✅ Report created successfully: " + savedReport.getReportCode());

            // THÊM DEBUG LOG SAU KHI LUU:
            System.out.println("🔍 DEBUG - Saved Referring Doctor Name: " + savedReport.getReferringDoctorName());
            System.out.println("🔍 DEBUG - Saved Referring Doctor Specialty: " + savedReport.getReferringDoctorSpecialty());

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
    @PostMapping("/test-post")
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
            System.out.println("📋 GET / called - Getting all reports");
            List<DiagnosticReport> reports = diagnosticReportService.getAllReports();
            return ResponseEntity.ok(new ApiResponse<>(
                    true, "Lấy danh sách báo cáo thành công", reports
            ));
        } catch (Exception e) {
            System.err.println("❌ Error getting all reports: " + e.getMessage());
            e.printStackTrace();
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
            System.out.println("🔍 GET /" + id + " called - Getting report by ID");
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
            System.err.println("❌ Error getting report by ID: " + e.getMessage());
            e.printStackTrace();
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
            System.out.println("📊 GET /statistics called");
            DiagnosticReportService.ReportStatistics stats = diagnosticReportService.getReportStatistics();
            return ResponseEntity.ok(new ApiResponse<>(
                    true, "Lấy thống kê báo cáo thành công", stats
            ));
        } catch (Exception e) {
            System.err.println("❌ Error getting statistics: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(
                    false, "Lỗi khi lấy thống kê: " + e.getMessage(), null
            ));
        }
    }

    /**
     * Generate new report code - GET method
     */
    @GetMapping("/generate-code")
    public ResponseEntity<ApiResponse<String>> generateReportCode() {
        try {
            System.out.println("🔢 GET /generate-code called");

            String reportCode = diagnosticReportService.generateReportCode();
            System.out.println("✅ Generated report code: " + reportCode);

            return ResponseEntity.ok(new ApiResponse<>(
                    true, "Tạo mã báo cáo thành công", reportCode
            ));
        } catch (Exception e) {
            System.err.println("❌ Error generating report code (GET): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(
                    false, "Lỗi khi tạo mã báo cáo: " + e.getMessage(), null
            ));
        }
    }

    /**
     * Generate new report code - POST method
     */
    @PostMapping("/generate-code")
    public ResponseEntity<ApiResponse<String>> generateReportCodePost() {
        try {
            System.out.println("🔢 POST /generate-code called");

            String reportCode = diagnosticReportService.generateReportCode();
            System.out.println("✅ Generated report code: " + reportCode);

            return ResponseEntity.ok(new ApiResponse<>(
                    true, "Tạo mã báo cáo thành công", reportCode
            ));
        } catch (Exception e) {
            System.err.println("❌ Error generating report code (POST): " + e.getMessage());
            e.printStackTrace();
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
        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public T getData() {
            return data;
        }

        public void setData(T data) {
            this.data = data;
        }

        @Override
        public String toString() {
            return "ApiResponse{" +
                    "success=" + success +
                    ", message='" + message + '\'' +
                    ", data=" + data +
                    '}';
        }
    }
}