package com.aidims.aidimsbackend.controller;

import com.aidims.aidimsbackend.dto.RequestPhotoDTO;
import com.aidims.aidimsbackend.service.RequestPhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/request-photo")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class RequestPhotoController {

    @Autowired
    private RequestPhotoService requestPhotoService;

    @GetMapping("/test")
    public ResponseEntity<?> testConnection() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Backend đang hoạt động với database");
        response.put("data", "OK");

        System.out.println("=== TEST ENDPOINT CALLED ===");
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody RequestPhotoDTO dto) {
        System.out.println("=== CREATE REQUEST CONTROLLER ===");
        System.out.println("Received DTO: " + dto.getPatientId() + ", " + dto.getImagingType());

        try {
            // Validate input
            if (dto.getPatientId() == null) {
                return ResponseEntity.badRequest()
                        .body(createResponse("error", "Patient ID không được để trống", null));
            }

            if (dto.getImagingType() == null || dto.getImagingType().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createResponse("error", "Loại chụp không được để trống", null));
            }

            if (dto.getBodyPart() == null || dto.getBodyPart().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createResponse("error", "Vị trí chụp không được để trống", null));
            }

            if (dto.getClinicalIndication() == null || dto.getClinicalIndication().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(createResponse("error", "Thông tin lâm sàng không được để trống", null));
            }

            RequestPhotoDTO result = requestPhotoService.createRequest(dto);
            System.out.println("Controller - Created successfully: " + result.getRequestCode());

            return ResponseEntity.ok(createResponse("success", "Tạo yêu cầu chụp thành công", result));

        } catch (Exception e) {
            System.err.println("Controller error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createResponse("error", "Lỗi server: " + e.getMessage(), null));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllRequests() {
        try {
            List<RequestPhotoDTO> requests = requestPhotoService.getAllRequests();
            return ResponseEntity.ok(createResponse("success", "Lấy danh sách thành công", requests));
        } catch (Exception e) {
            System.err.println("Error getting all requests: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createResponse("error", e.getMessage(), null));
        }
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getRequestsByPatient(@PathVariable Long patientId) {
        try {
            List<RequestPhotoDTO> requests = requestPhotoService.getRequestsByPatientId(patientId);
            return ResponseEntity.ok(createResponse("success", "Lấy danh sách thành công", requests));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createResponse("error", e.getMessage(), null));
        }
    }

    private Map<String, Object> createResponse(String status, String message, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", status);
        response.put("message", message);
        response.put("data", data);
        return response;
    }
}