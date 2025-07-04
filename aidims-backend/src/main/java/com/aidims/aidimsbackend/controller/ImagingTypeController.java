package com.aidims.aidimsbackend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aidims.aidimsbackend.entity.ImagingType;
import com.aidims.aidimsbackend.service.ImagingTypeService;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/imaging-types")
@CrossOrigin(origins = "*")
public class ImagingTypeController {

    @Autowired
    private ImagingTypeService imagingTypeService;

    @GetMapping("/{code}")
    public ResponseEntity<?> getImagingParams(@PathVariable String code) {
        ImagingType type = imagingTypeService.getByCode(code);
        if (type == null) {
            return ResponseEntity.status(404).body("Không tìm thấy imaging type cho: " + code);
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> settings = mapper.readValue(type.getDefaultSettings(), Map.class);
            return ResponseEntity.ok(settings); // Trả về JSON object chứa các thông số kỹ thuật
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Không đọc được default_settings");
        }
    }
}
