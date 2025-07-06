package com.aidims.aidimsbackend.controller;

import com.aidims.aidimsbackend.service.CompareImagesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/compare-images")
@CrossOrigin(origins = "*")
public class CompareImagesController {

    @Autowired
    private CompareImagesService compareImagesService;

    /**
     * So sánh tất cả ảnh của bệnh nhân theo keyword (mã hoặc tên)
     */
   @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchPatientImages(@RequestParam String keyword) {
        try {
            List<Map<String, Object>> images = compareImagesService.searchByPatientCode(keyword); // 👈 sửa tại đây
            System.out.println("✅ Found " + images.size() + " images for keyword: " + keyword);
            return ResponseEntity.ok(images);
        } catch (Exception e) {
            System.err.println("❌ Error in compare-images/search: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Test endpoint
     */
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("✅ CompareImages API is active.");
    }
}
