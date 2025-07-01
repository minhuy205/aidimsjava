package com.aidims.aidimsbackend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aidims.aidimsbackend.entity.DicomImport;
import com.aidims.aidimsbackend.entity.VerifyImage;
import com.aidims.aidimsbackend.repository.DicomImportRepository;
import com.aidims.aidimsbackend.service.VerifyImageService;

@RestController
@RequestMapping("/api/verify-image")
@CrossOrigin(origins = "http://localhost:3000") // Cho phép CORS cho frontend React
public class VerifyImageController {
    @Autowired
    private VerifyImageService verifyImageService;
    @Autowired
    private DicomImportRepository dicomImportRepository;

    @PostMapping("/save")
    public ResponseEntity<?> saveVerifyImage(@RequestBody VerifyImage verifyImage) {
        // Validate các trường bắt buộc
        if (verifyImage.getImageId() == null || verifyImage.getCheckedBy() == null || verifyImage.getResult() == null || verifyImage.getResult().isEmpty()) {
            return ResponseEntity.badRequest().body("Thiếu thông tin bắt buộc: imageId, checkedBy, result");
        }
        VerifyImage saved = verifyImageService.saveVerifyImage(verifyImage);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/all")
    public ResponseEntity<List<VerifyImage>> getAllVerifyImages() {
        return ResponseEntity.ok(verifyImageService.getAllVerifyImages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VerifyImage> getVerifyImageById(@PathVariable Long id) {
        return verifyImageService.getVerifyImageById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/dicom-imports")
    public ResponseEntity<List<DicomImport>> getAllDicomImports() {
        // Lấy toàn bộ ảnh đã import để kiểm tra
        return ResponseEntity.ok(dicomImportRepository.findAll());
    }
}
