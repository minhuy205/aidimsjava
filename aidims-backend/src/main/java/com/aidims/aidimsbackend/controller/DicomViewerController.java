package com.aidims.aidimsbackend.controller;

import com.aidims.aidimsbackend.service.DicomViewerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dicom-viewer")
@CrossOrigin(origins = "*")
public class DicomViewerController {

    @Autowired
    private DicomViewerService dicomViewerService;

    /**
     * Lấy tất cả DICOM từ bảng dicom_imports
     */
    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllDicomViewer() {
        try {
            List<Map<String, Object>> dicoms = dicomViewerService.getAllDicomViewer();
            System.out.println("✅ Trả về " + dicoms.size() + " DICOM records");
            return ResponseEntity.ok(dicoms);
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi lấy DICOM records: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Lấy DICOM theo ID từ bảng dicom_imports
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getDicomViewerById(@PathVariable Long id) {
        try {
            Map<String, Object> dicom = dicomViewerService.getDicomViewerById(id);
            if (dicom != null) {
                return ResponseEntity.ok(dicom);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi lấy DICOM ID " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Lấy DICOM theo mã bệnh nhân từ bảng dicom_imports
     */
    @GetMapping("/patient/{patientCode}")
    public ResponseEntity<List<Map<String, Object>>> getDicomViewerByPatient(@PathVariable String patientCode) {
        try {
            List<Map<String, Object>> dicoms = dicomViewerService.getDicomViewerByPatient(patientCode);
            return ResponseEntity.ok(dicoms);
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi lấy DICOM của bệnh nhân " + patientCode + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Tìm kiếm DICOM từ bảng dicom_imports
     */
    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchDicomViewer(@RequestParam String keyword) {
        try {
            List<Map<String, Object>> dicoms = dicomViewerService.searchDicomViewer(keyword);
            return ResponseEntity.ok(dicoms);
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi search DICOM: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Lấy thống kê DICOM
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDicomViewerStats() {
        try {
            Map<String, Object> stats = dicomViewerService.getDicomViewerStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi lấy thống kê DICOM: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * QUAN TRỌNG: Serve ảnh từ đường dẫn trong bảng dicom_imports
     */
    @GetMapping("/image/{fileName:.+}")
    public ResponseEntity<Resource> serveImageFromDicomViewer(@PathVariable String fileName) {
        try {
            System.out.println("🔍 Đang tìm file: " + fileName);

            // Lấy đường dẫn thực tế từ database
            String actualFilePath = dicomViewerService.getDicomViewerFilePath(fileName);

            if (actualFilePath == null) {
                System.err.println("❌ Không tìm thấy file trong database: " + fileName);
                return ResponseEntity.notFound().build();
            }

            System.out.println("📂 Đường dẫn file: " + actualFilePath);

            // Tạo Path từ đường dẫn thực tế
            Path filePath = Paths.get(actualFilePath);

            // Kiểm tra file có tồn tại không
            if (!Files.exists(filePath)) {
                System.err.println("❌ File không tồn tại trên disk: " + actualFilePath);
                return ResponseEntity.notFound().build();
            }

            // Tạo Resource từ file
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                // Xác định content type
                String contentType = determineContentType(fileName);

                System.out.println("✅ Serving image: " + fileName);
                System.out.println("📁 From path: " + actualFilePath);
                System.out.println("🎭 Content type: " + contentType);

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                        .header(HttpHeaders.CACHE_CONTROL, "max-age=3600")
                        .header("Access-Control-Allow-Origin", "*")
                        .body(resource);
            } else {
                System.err.println("❌ File không đọc được: " + actualFilePath);
                return ResponseEntity.notFound().build();
            }

        } catch (MalformedURLException e) {
            System.err.println("❌ URL không hợp lệ: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("❌ Lỗi serve image: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Download file từ bảng dicom_imports
     */
    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFileFromDicomViewer(@PathVariable String fileName) {
        try {
            String actualFilePath = dicomViewerService.getDicomViewerFilePath(fileName);

            if (actualFilePath == null) {
                return ResponseEntity.notFound().build();
            }

            Path filePath = Paths.get(actualFilePath);

            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                System.out.println("📥 Download file: " + fileName + " from: " + actualFilePath);

                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("❌ Lỗi download: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Test endpoint
     */
    @GetMapping("/test")
    public ResponseEntity<String> testConnection() {
        return ResponseEntity.ok("✅ DICOM Viewer API đang hoạt động! Kết nối với bảng dicom_imports thành công.");
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        try {
            // Test database connection
            List<Map<String, Object>> dicoms = dicomViewerService.getAllDicomViewer();
            Map<String, Object> stats = dicomViewerService.getDicomViewerStats();

            Map<String, Object> health = Map.of(
                    "status", "healthy",
                    "timestamp", System.currentTimeMillis(),
                    "database", "connected",
                    "dicom_count", dicoms.size(),
                    "stats", stats
            );

            return ResponseEntity.ok(health);
        } catch (Exception e) {
            Map<String, Object> health = Map.of(
                    "status", "unhealthy",
                    "timestamp", System.currentTimeMillis(),
                    "error", e.getMessage()
            );

            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(health);
        }
    }

    /**
     * Xác định content type từ file extension
     */
    private String determineContentType(String fileName) {
        String extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

        switch (extension) {
            case "png":
                return "image/png";
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "gif":
                return "image/gif";
            case "bmp":
                return "image/bmp";
            case "webp":
                return "image/webp";
            case "dcm":
                return "application/dicom";
            default:
                return "application/octet-stream";
        }
    }
}