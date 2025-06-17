package com.aidims.aidimsbackend.controller;

import com.aidims.aidimsbackend.service.DicomViewerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dicom")
@CrossOrigin(origins = "*")
public class DicomViewerController {

    @Autowired
    private DicomViewerService dicomViewerService;

    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllDicomImages() {
        return ResponseEntity.ok(dicomViewerService.getAllDicomImages());
    }
}
