package com.aidims.aidimsbackend.controller;

import com.aidims.aidimsbackend.dto.DicomAnalysisResponse.DicomMetadata;
import com.aidims.aidimsbackend.service.ChatService;
import com.aidims.aidimsbackend.service.DicomConverterService;
import com.aidims.aidimsbackend.service.DicomConverterService.ConvertResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class DicomAnalysisControllerTest {

    private MockMvc mockMvc;

    @Mock
    private DicomConverterService dicomConverter;

    @Mock
    private ChatService chatService;

    @InjectMocks
    private DicomAnalysisController dicomAnalysisController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(dicomAnalysisController).build();
    }

    @Test
    void analyzeDicom_withEmptyFile_returnsBadRequest() throws Exception {
        // Create an empty file
        MockMultipartFile emptyFile = new MockMultipartFile(
                "file",
                "empty.dcm",
                "application/dicom",
                new byte[0]
        );

        mockMvc.perform(multipart("/api/dicom/analyze")
                        .file(emptyFile)
                        .param("message", "Test message"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.analysisText").value("File rỗng"));
    }

    @Test
    void analyzeDicom_withNonDcmFile_returnsBadRequest() throws Exception {
        // Create a non-dcm file (e.g. png)
        MockMultipartFile pngFile = new MockMultipartFile(
                "file",
                "test_image.png",
                "image/png",
                "some-image-data".getBytes()
        );

        mockMvc.perform(multipart("/api/dicom/analyze")
                        .file(pngFile)
                        .param("message", "Test message"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.analysisText").value("Chỉ hỗ trợ file .dcm"));
    }

    @Test
    void analyzeDicom_withValidDcmFile_returnsSuccess() throws Exception {
        // Create a mock DICOM file
        MockMultipartFile validDcm = new MockMultipartFile(
                "file",
                "valid_scan.dcm",
                "application/dicom",
                "mock-dicom-bytes".getBytes()
        );

        // Prepare dummy converter result
        DicomMetadata metadata = new DicomMetadata();
        metadata.setModality("CT");
        metadata.setBodyPart("CHEST");
        metadata.setPatientId("PAT-12345");
        metadata.setPatientName("John Doe");
        metadata.setPatientBirthDate("19800101");
        metadata.setPatientSex("M");
        metadata.setStudyDescription("Chest scan");
        metadata.setImageSize("512 x 512");

        ConvertResult convertResult = new ConvertResult("mockBase64JpegString", metadata);

        // Mock service calls
        Mockito.when(dicomConverter.convert(any(byte[].class))).thenReturn(convertResult);
        Mockito.when(chatService.analyzeImages(any())).thenReturn("Gemini diagnostic scan details");

        mockMvc.perform(multipart("/api/dicom/analyze")
                        .file(validDcm)
                        .param("message", "Phân tích ảnh này giúp tôi"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.analysisText").value("Gemini diagnostic scan details"))
                .andExpect(jsonPath("$.dicomImageBase64").value("data:image/jpeg;base64,mockBase64JpegString"))
                .andExpect(jsonPath("$.metadata.modality").value("CT"))
                .andExpect(jsonPath("$.metadata.patientName").value("John Doe"));
    }
}
