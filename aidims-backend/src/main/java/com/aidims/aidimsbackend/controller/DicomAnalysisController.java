package com.aidims.aidimsbackend.controller;

import com.aidims.aidimsbackend.dto.DicomAnalysisResponse;
import com.aidims.aidimsbackend.dto.ImageAnalysisRequest;
import com.aidims.aidimsbackend.service.ChatService;
import com.aidims.aidimsbackend.service.DicomConverterService;
import com.aidims.aidimsbackend.service.DicomConverterService.ConvertResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/dicom")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:3001","http://127.0.0.1:3000"})
public class DicomAnalysisController {

    private static final Logger logger = LoggerFactory.getLogger(DicomAnalysisController.class);

    private final DicomConverterService dicomConverter;
    private final ChatService chatService;

    public DicomAnalysisController(DicomConverterService dicomConverter,
                                   ChatService chatService) {
        this.dicomConverter = dicomConverter;
        this.chatService    = chatService;
    }

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DicomAnalysisResponse> analyzeDicom(
            @RequestParam("file")    MultipartFile file,
            @RequestParam(value = "message", defaultValue = "Phân tích hình ảnh DICOM này") String message,
            @RequestParam(value = "windowCenter", required = false) Double windowCenter,
            @RequestParam(value = "windowWidth",  required = false) Double windowWidth) {

        String filename = file.getOriginalFilename();
        logger.info("DICOM upload: {} ({} bytes)", filename, file.getSize());

        // ── Validate ──────────────────────────────────────────────────────
        if (file.isEmpty())
            return bad("File rỗng");
        if (file.getSize() > 100L * 1024 * 1024)
            return bad("File quá lớn (tối đa 100MB)");
        if (filename != null && !filename.toLowerCase().endsWith(".dcm"))
            return bad("Chỉ hỗ trợ file .dcm");

        try {
            // ── 1. Convert DICOM → base64 JPEG + metadata ─────────────────
            byte[] bytes = file.getBytes();
            ConvertResult converted = dicomConverter.convert(bytes);

            logger.info("DICOM converted, base64 length={}", converted.base64Jpeg.length());

            // ── 2. Tạo prompt có kèm metadata cho Gemini ──────────────────
            String metaInfo = buildMetaPrompt(converted.metadata, filename);
            String fullMessage = message + "\n\n" + metaInfo;

            // ── 3. Gọi Gemini Vision qua ChatService ──────────────────────
            ImageAnalysisRequest req = new ImageAnalysisRequest();
            req.setMessage(fullMessage);

            List<ImageAnalysisRequest.ImageData> images = new ArrayList<>();
            ImageAnalysisRequest.ImageData img = new ImageAnalysisRequest.ImageData();
            img.setName(filename != null ? filename : "dicom.dcm");
            img.setType("image/jpeg");
            img.setData(converted.base64Jpeg);
            img.setSize(converted.base64Jpeg.length());
            images.add(img);
            req.setImages(images);

            String analysisText = chatService.analyzeImages(req);

            // ── 4. Trả về response đầy đủ ─────────────────────────────────
            DicomAnalysisResponse response = new DicomAnalysisResponse(
                    analysisText,
                    "data:image/jpeg;base64," + converted.base64Jpeg,  // data URL cho <img>
                    converted.metadata,
                    "success"
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("DICOM analysis failed: ", e);
            return ResponseEntity.status(500).body(
                new DicomAnalysisResponse(
                    "❌ Lỗi phân tích DICOM: " + e.getMessage(),
                    null, null, "error"));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("DICOM service running");
    }

    // ── helpers ───────────────────────────────────────────────────────────

    private String buildMetaPrompt(DicomAnalysisResponse.DicomMetadata m, String filename) {
        return "[THÔNG TIN DICOM FILE: " + filename + "]\n" +
               "- Modality: "          + m.getModality()          + "\n" +
               "- Body Part: "         + m.getBodyPart()          + "\n" +
               "- Study: "             + m.getStudyDescription()  + "\n" +
               "- Patient Sex: "       + m.getPatientSex()        + "\n" +
               "- Study Date: "        + m.getStudyDate()         + "\n" +
               "- Image Size: "        + m.getImageSize()         + "\n" +
               "- Bits Allocated: "    + m.getBitsAllocated()     + "\n" +
               "- KVP: "               + m.getKvp()               + "\n" +
               "- Exposure Time: "     + m.getExposureTime()      + " ms\n" +
               "- Institution: "       + m.getInstitutionName()   + "\n" +
               "Hãy phân tích hình ảnh dựa trên các thông tin trên.";
    }

    private ResponseEntity<DicomAnalysisResponse> bad(String msg) {
        return ResponseEntity.badRequest().body(
            new DicomAnalysisResponse(msg, null, null, "error"));
    }
}