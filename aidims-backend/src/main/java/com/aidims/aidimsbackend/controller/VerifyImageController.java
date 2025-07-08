package com.aidims.aidimsbackend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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
@CrossOrigin(origins = "http://localhost:3000")
public class VerifyImageController {

    @Autowired
    private VerifyImageService verifyImageService;

    @Autowired
    private DicomImportRepository dicomImportRepository;

    @PostMapping("/save")
    public ResponseEntity<?> saveVerifyImage(@RequestBody VerifyImage verifyImage) {
        try {
            // Validate required fields
            if (verifyImage.getImageId() == null || verifyImage.getCheckedBy() == null ||
                verifyImage.getResult() == null) {
                return ResponseEntity.badRequest().body("Missing required fields: imageId, checkedBy, result");
            }

            // Check if image exists
            if (!dicomImportRepository.existsById(verifyImage.getImageId())) {
                return ResponseEntity.badRequest().body("Image not found with id: " + verifyImage.getImageId());
            }

            // Set current time
            verifyImage.setCheckTime(LocalDateTime.now());

            // Save verification
            VerifyImage saved = verifyImageService.saveVerifyImage(verifyImage);

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error saving verification: " + e.getMessage());
        }
    }

    @GetMapping("/dicom-imports")
    public ResponseEntity<List<DicomImport>> getAllDicomImports() {
        try {
            return ResponseEntity.ok(dicomImportRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<VerifyImage>> getAllVerifyImages() {
        try {
            List<VerifyImage> verifyImages = verifyImageService.getAllVerifyImages();
            return ResponseEntity.ok(verifyImages);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<VerifyImage> getVerifyImageById(@PathVariable Long id) {
        try {
            return verifyImageService.getVerifyImageById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateImageStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            if (status == null) {
                return ResponseEntity.badRequest().body("Missing status");
            }
            // Lấy bản ghi ảnh cần cập nhật
            Optional<VerifyImage> optional = verifyImageService.getVerifyImageById(id);
            if (optional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            VerifyImage image = optional.get();
            image.setResult(status); // "approved" hoặc "rejected"
            image.setCheckTime(LocalDateTime.now());
            verifyImageService.saveVerifyImage(image);
            return ResponseEntity.ok(image);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating status: " + e.getMessage());
        }
    }

    @GetMapping("/status-summary")
    public ResponseEntity<?> getVerifyStatusSummary() {
        List<VerifyImage> all = verifyImageService.getAllVerifyImages();
        long daDuyet = all.stream().filter(v -> "approved".equalsIgnoreCase(v.getResult())).count();
        long chuaDuyet = all.stream().filter(v -> !"approved".equalsIgnoreCase(v.getResult())).count();
        return ResponseEntity.ok(Map.of(
            "daDuyet", daDuyet,
            "chuaDuyet", chuaDuyet,
            "tong", all.size()
        ));
    }

    @GetMapping("/summary-stats")
    public ResponseEntity<?> getVerifyImageStats() {
        List<DicomImport> allImports = dicomImportRepository.findAll();
        List<VerifyImage> allVerifies = verifyImageService.getAllVerifyImages();
        Map<Long, VerifyImage> verifyMap = allVerifies.stream()
            .collect(java.util.stream.Collectors.toMap(VerifyImage::getImageId, v -> v, (a, b) -> a));
        int tong = allImports.size();
        int daDuyet = 0, tuChoi = 0, choDuyet = 0;
        for (DicomImport di : allImports) {
            VerifyImage vi = verifyMap.get(di.getId());
            if (vi == null) choDuyet++;
            else if ("approved".equalsIgnoreCase(vi.getResult())) daDuyet++;
            else if ("rejected".equalsIgnoreCase(vi.getResult())) tuChoi++;
            else choDuyet++;
        }
        return ResponseEntity.ok(Map.of(
            "tong", tong,
            "daDuyet", daDuyet,
            "choDuyet", choDuyet,
            "tuChoi", tuChoi
        ));
    }

}
