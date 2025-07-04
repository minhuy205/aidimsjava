/* package com.aidims.aidimsbackend.controller;

import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aidims.aidimsbackend.entity.DicomImport;
import com.aidims.aidimsbackend.service.DicomImportService;

@RestController
@RequestMapping("/api/dicom-import")
@CrossOrigin(origins = "*")
public class DicomImportController {
    @Autowired
    private DicomImportService dicomImportService;

    @PostMapping("/import")
    public ResponseEntity<?> importDicom(
            @RequestParam("file") MultipartFile file,
            @RequestParam("patient_code") String patientCode,
            @RequestParam("study_type") String studyType,
            @RequestParam("body_part") String bodyPart,
            @RequestParam("technical_params") String technicalParams,
            @RequestParam(value = "notes", required = false) String notes,
            @RequestParam(value = "performed_by", required = false) String performedBy
    ) {
        System.out.println("[DicomImport] Nhận file: " + (file != null ? file.getOriginalFilename() : "null") + ", size: " + (file != null ? file.getSize() : "null"));
        if (file == null || file.isEmpty()) {
            System.out.println("[DicomImport] File null hoặc empty!");
            return ResponseEntity.status(400).body("Không nhận được file từ frontend!");
        }
        // Lưu file vào thư mục dicom_uploads tuyệt đối
        String uploadDir = System.getProperty("user.dir") + "/aidims-backend/dicom_uploads/";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();
        String filePath = uploadDir + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        try {
            file.transferTo(new File(filePath));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi khi lưu file: " + e.getMessage());
        }
        System.out.println("[DicomImport] File saved to: " + filePath);

        // Tạo entity và lưu vào DB
        DicomImport dicomImport = new DicomImport();
        dicomImport.setFileName(file.getOriginalFilename());
        dicomImport.setFilePath(filePath);
        dicomImport.setFileSize(file.getSize());
        dicomImport.setPatientCode(patientCode);
        dicomImport.setStudyType(studyType);
        dicomImport.setBodyPart(bodyPart);
        dicomImport.setTechnicalParams(technicalParams);
        dicomImport.setNotes(notes);
        dicomImport.setStatus("imported");
        dicomImport.setPerformedBy(performedBy);
        dicomImportService.saveDicomImport(dicomImport);
        return ResponseEntity.ok("Import thành công");
    }
}
 */
package com.aidims.aidimsbackend.controller;

import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aidims.aidimsbackend.entity.DicomImport;
import com.aidims.aidimsbackend.service.DicomImportService;
import com.aidims.aidimsbackend.service.DicomFileService; // Thêm import này

@RestController
@RequestMapping("/api/dicom-import")
@CrossOrigin(origins = "*")
public class DicomImportController {
    @Autowired
    private DicomImportService dicomImportService;

    @Autowired
    private DicomFileService dicomFileService; // Inject DicomFileService

   @PostMapping("/import")
public ResponseEntity<?> importDicom(
        @RequestParam("file") MultipartFile file,
        @RequestParam("patient_code") String patientCode,
        @RequestParam("study_type") String studyType,
        @RequestParam("body_part") String bodyPart,
        @RequestParam("technical_params") String technicalParams,
        @RequestParam(value = "notes", required = false) String notes,
        @RequestParam(value = "performed_by", required = false) String performedBy
) {
    System.out.println("[DicomImport] Nhận file: " + (file != null ? file.getOriginalFilename() : "null") + ", size: " + (file != null ? file.getSize() : "null"));
    if (file == null || file.isEmpty()) {
        System.out.println("[DicomImport] File null hoặc empty!");
        return ResponseEntity.status(400).body("Không nhận được file từ frontend!");
    }
    // Lưu file vào thư mục dicom_uploads tuyệt đối
    String uploadDir = System.getProperty("user.dir") + "/aidims-backend/dicom_uploads/";
    File dir = new File(uploadDir);
    if (!dir.exists()) dir.mkdirs();
    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
    String filePath = uploadDir + fileName;
    try {
        // 1. Lưu file vào backend
        file.transferTo(new File(filePath));

        // 2. Copy file vừa lưu sang frontend/public/dicom_uploads
        dicomFileService.copyFileToFrontend(new File(filePath), fileName);

    } catch (IOException e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Lỗi khi lưu file: " + e.getMessage());
    }
    System.out.println("[DicomImport] File saved to: " + filePath);

    // Tạo entity và lưu vào DB
    DicomImport dicomImport = new DicomImport();
    dicomImport.setFileName(file.getOriginalFilename());
    dicomImport.setFilePath(filePath);
    dicomImport.setFileSize(file.getSize());
    dicomImport.setPatientCode(patientCode);
    dicomImport.setStudyType(studyType);
    dicomImport.setBodyPart(bodyPart);
    dicomImport.setTechnicalParams(technicalParams);
    dicomImport.setNotes(notes);
    dicomImport.setStatus("imported");
    dicomImport.setPerformedBy(performedBy);
    dicomImportService.saveDicomImport(dicomImport);
    return ResponseEntity.ok("Import thành công");
    }
}