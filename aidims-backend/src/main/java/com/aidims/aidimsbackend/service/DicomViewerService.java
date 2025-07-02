package com.aidims.aidimsbackend.service;

import com.aidims.aidimsbackend.repository.ImagingResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DicomViewerService {

    @Autowired
    private ImagingResultRepository imagingResultRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Value("${server.port:8080}")
    private String serverPort;

    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    // ========== CHỨC NĂNG CŨ (GIỮ NGUYÊN) ==========

    /**
     * Method cũ - lấy từ imaging_results (GIỮ NGUYÊN)
     */
    public List<Map<String, Object>> getAllDicomImages() {
        return imagingResultRepository.fetchDicomInfoWithPatient();
    }

    // ========== CHỨC NĂNG MỚI - DICOM VIEWER ==========

    /**
     * Lấy tất cả DICOM từ bảng dicom_imports
     */
    public List<Map<String, Object>> getAllDicomViewer() {
        String sql = """
            SELECT 
                di.id,
                di.body_part,
                di.file_name,
                di.file_path,
                di.file_size,
                di.import_date,
                di.notes,
                di.patient_code,
                di.performed_by,
                di.status,
                di.study_type,
                di.technical_params,
                p.full_name as patient_name,
                p.date_of_birth,
                p.gender,
                p.phone as patient_phone,
                u.full_name as performed_by_name
            FROM dicom_imports di
            LEFT JOIN patient p ON di.patient_code = p.patient_code
            LEFT JOIN users u ON di.performed_by = u.user_id
            WHERE di.status = 'imported'
            AND di.file_name IS NOT NULL 
            AND di.file_name != ''
            AND di.file_path IS NOT NULL
            ORDER BY di.import_date DESC
            """;

        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql);

        System.out.println("🔍 Found " + results.size() + " DICOM records with actual files");

        // Transform data để phù hợp với frontend
        return results.stream()
                .map(this::transformDicomViewerData)
                .toList();
    }

    /**
     * Lấy DICOM theo ID từ bảng dicom_imports
     */
    public Map<String, Object> getDicomViewerById(Long id) {
        String sql = """
            SELECT 
                di.id,
                di.body_part,
                di.file_name,
                di.file_path,
                di.file_size,
                di.import_date,
                di.notes,
                di.patient_code,
                di.performed_by,
                di.status,
                di.study_type,
                di.technical_params,
                p.full_name as patient_name,
                p.date_of_birth,
                p.gender,
                p.phone as patient_phone,
                p.address,
                p.blood_type,
                p.allergies,
                p.medical_history,
                u.full_name as performed_by_name,
                u.email as performed_by_email
            FROM dicom_imports di
            LEFT JOIN patient p ON di.patient_code = p.patient_code
            LEFT JOIN users u ON di.performed_by = u.user_id
            WHERE di.id = ?
            """;

        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, id);

        if (results.isEmpty()) {
            return null;
        }

        return transformDicomViewerData(results.get(0));
    }

    /**
     * Lấy DICOM theo mã bệnh nhân từ bảng dicom_imports
     */
    public List<Map<String, Object>> getDicomViewerByPatient(String patientCode) {
        String sql = """
            SELECT 
                di.id,
                di.body_part,
                di.file_name,
                di.file_path,
                di.file_size,
                di.import_date,
                di.notes,
                di.patient_code,
                di.performed_by,
                di.status,
                di.study_type,
                di.technical_params,
                p.full_name as patient_name,
                u.full_name as performed_by_name
            FROM dicom_imports di
            LEFT JOIN patient p ON di.patient_code = p.patient_code
            LEFT JOIN users u ON di.performed_by = u.user_id
            WHERE di.patient_code = ? AND di.status = 'imported'
            ORDER BY di.import_date DESC
            """;

        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, patientCode);

        return results.stream()
                .map(this::transformDicomViewerData)
                .toList();
    }

    /**
     * Tìm kiếm DICOM theo từ khóa trong bảng dicom_imports
     */
    public List<Map<String, Object>> searchDicomViewer(String keyword) {
        String sql = """
            SELECT 
                di.id,
                di.body_part,
                di.file_name,
                di.file_path,
                di.file_size,
                di.import_date,
                di.notes,
                di.patient_code,
                di.performed_by,
                di.status,
                di.study_type,
                di.technical_params,
                p.full_name as patient_name,
                u.full_name as performed_by_name
            FROM dicom_imports di
            LEFT JOIN patient p ON di.patient_code = p.patient_code
            LEFT JOIN users u ON di.performed_by = u.user_id
            WHERE di.status = 'imported' 
            AND (
                di.file_name LIKE ? OR 
                di.patient_code LIKE ? OR 
                p.full_name LIKE ? OR
                di.study_type LIKE ? OR
                di.body_part LIKE ? OR
                di.notes LIKE ?
            )
            ORDER BY di.import_date DESC
            """;

        String searchPattern = "%" + keyword + "%";
        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql,
                searchPattern, searchPattern, searchPattern,
                searchPattern, searchPattern, searchPattern);

        return results.stream()
                .map(this::transformDicomViewerData)
                .toList();
    }

    /**
     * Lấy đường dẫn file từ tên file trong bảng dicom_imports
     */
    public String getDicomViewerFilePath(String fileName) {
        String sql = """
            SELECT file_path 
            FROM dicom_imports 
            WHERE file_name = ? 
            AND status = 'imported'
            LIMIT 1
            """;

        try {
            List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, fileName);
            if (!results.isEmpty()) {
                return (String) results.get(0).get("file_path");
            }
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi lấy file path: " + e.getMessage());
        }

        return null;
    }

    /**
     * Lấy thống kê DICOM
     */
    public Map<String, Object> getDicomViewerStats() {
        String sql = """
            SELECT 
                COUNT(*) as total_count,
                COUNT(CASE WHEN study_type = 'MRI' THEN 1 END) as mri_count,
                COUNT(CASE WHEN study_type = 'CT' THEN 1 END) as ct_count,
                COUNT(CASE WHEN study_type = 'X-Ray' THEN 1 END) as xray_count,
                COUNT(CASE WHEN study_type = 'Ultrasound' THEN 1 END) as ultrasound_count,
                SUM(file_size) as total_size,
                COUNT(DISTINCT patient_code) as unique_patients
            FROM dicom_imports 
            WHERE status = 'imported'
            """;

        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql);

        if (!results.isEmpty()) {
            return results.get(0);
        }

        return new HashMap<>();
    }

    // ========== HELPER METHODS ==========

    /**
     * Transform data từ database thành format cho frontend
     */
    private Map<String, Object> transformDicomViewerData(Map<String, Object> row) {
        Map<String, Object> transformed = new HashMap<>();

        // Basic info
        transformed.put("id", row.get("id"));
        transformed.put("fileName", row.get("file_name"));
        transformed.put("description", row.get("notes") != null ? row.get("notes") : "Không có mô tả");
        transformed.put("modality", row.get("study_type") != null ? row.get("study_type") : "N/A");
        transformed.put("patientCode", row.get("patient_code"));
        transformed.put("bodyPart", row.get("body_part") != null ? row.get("body_part") : "N/A");
        transformed.put("status", row.get("status"));
        transformed.put("performedBy", row.get("performed_by_name") != null ? row.get("performed_by_name") : "N/A");
        transformed.put("fileSize", row.get("file_size"));
        transformed.put("technicalParams", row.get("technical_params"));

        // Format date
        Object importDate = row.get("import_date");
        if (importDate != null) {
            if (importDate instanceof LocalDateTime) {
                transformed.put("dateTaken", ((LocalDateTime) importDate).format(dateFormatter));
            } else {
                transformed.put("dateTaken", importDate.toString());
            }
        } else {
            transformed.put("dateTaken", "N/A");
        }

        // Patient info
        String patientName = (String) row.get("patient_name");
        if (patientName != null && !patientName.trim().isEmpty()) {
            transformed.put("fullName", patientName);
        } else {
            String patientCode = (String) row.get("patient_code");
            transformed.put("fullName", "Bệnh nhân " + (patientCode != null ? patientCode : "N/A"));
        }

        // 🔍 DEBUG: Log để kiểm tra fileName
        String fileName = (String) row.get("file_name");
        String filePath = (String) row.get("file_path");
        System.out.println("🔍 DEBUG Record ID: " + row.get("id") +
                " | FileName: " + fileName +
                " | PatientCode: " + row.get("patient_code"));

        // Image URL for frontend - CHỈ generate nếu có fileName
        if (fileName != null && !fileName.trim().isEmpty()) {
            transformed.put("imageUrl", generateImageUrl(fileName));
            System.out.println("✅ Generated imageUrl for: " + fileName);
        } else {
            transformed.put("imageUrl", null);
            System.out.println("❌ No fileName for record ID: " + row.get("id"));
        }

        // Original file path
        transformed.put("dicomFilePath", filePath);

        return transformed;
    }

    /**
     * Generate URL cho ảnh
     */
    private String generateImageUrl(String fileName) {
        if (fileName == null) return null;
        return "http://localhost:" + serverPort + "/api/dicom-viewer/image/" + fileName;
    }
}