package com.aidims.aidimsbackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.*;

@Service
public class ChatService {

    @Value("${openai.api.key:}")
    private String openaiApiKey;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    // Medical Knowledge Base
    private final Map<String, MedicalCondition> medicalKnowledgeBase;
    private final Map<String, List<String>> symptomGroups;
    private final Map<String, DiagnosticInfo> diagnosticDatabase;
    private final Map<String, ImagingPattern> imagingPatterns;

    // Inner Classes
    private static class MedicalCondition {
        String name;
        List<String> symptoms;
        List<String> causes;
        List<String> diagnostics;
        String severity;
        String treatment;

        MedicalCondition(String name, List<String> symptoms, List<String> causes,
                         List<String> diagnostics, String severity, String treatment) {
            this.name = name;
            this.symptoms = symptoms;
            this.causes = causes;
            this.diagnostics = diagnostics;
            this.severity = severity;
            this.treatment = treatment;
        }
    }

    private static class DiagnosticInfo {
        String test;
        List<String> indications;
        String findings;
        String interpretation;

        DiagnosticInfo(String test, List<String> indications, String findings, String interpretation) {
            this.test = test;
            this.indications = indications;
            this.findings = findings;
            this.interpretation = interpretation;
        }
    }

    private static class ImagingPattern {
        String modality;
        String pattern;
        List<String> differentialDiagnosis;
        String urgency;

        ImagingPattern(String modality, String pattern, List<String> differentialDiagnosis, String urgency) {
            this.modality = modality;
            this.pattern = pattern;
            this.differentialDiagnosis = differentialDiagnosis;
            this.urgency = urgency;
        }
    }

    public ChatService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(2048 * 1024))
                .build();
        this.objectMapper = new ObjectMapper();

        // Initialize knowledge bases
        this.medicalKnowledgeBase = initializeMedicalKnowledgeBase();
        this.symptomGroups = initializeSymptomGroups();
        this.diagnosticDatabase = initializeDiagnosticDatabase();
        this.imagingPatterns = initializeImagingPatterns();
    }

    private Map<String, MedicalCondition> initializeMedicalKnowledgeBase() {
        Map<String, MedicalCondition> kb = new HashMap<>();

        // Tim mạch
        kb.put("đau_ngực", new MedicalCondition(
                "Đau ngực",
                Arrays.asList("đau ngực", "khó thở", "hồi hộp", "đau lan ra tay trái"),
                Arrays.asList("bệnh mạch vành", "nhồi máu cơ tim", "viêm màng ngoài tim"),
                Arrays.asList("ECG", "Troponin", "Echo tim", "CT mạch vành"),
                "Cao - Cần đánh giá ngay",
                "Aspirin, Nitrate, PCI khẩn cấp nếu STEMI"
        ));

        kb.put("suy_tim", new MedicalCondition(
                "Suy tim",
                Arrays.asList("khó thở", "phù chân", "mệt mỏi", "thở khó khi nằm"),
                Arrays.asList("tăng huyết áp", "bệnh mạch vành", "van tim"),
                Arrays.asList("BNP/NT-proBNP", "Echo tim", "X-quang ngực"),
                "Trung bình - Cao",
                "ACE-I, Beta-blocker, Lợi tiểu"
        ));

        // Hô hấp
        kb.put("viêm_phổi", new MedicalCondition(
                "Viêm phổi",
                Arrays.asList("ho có đờm", "sốt", "khó thở", "đau ngực khi thở"),
                Arrays.asList("vi khuẩn", "virus", "nấm"),
                Arrays.asList("X-quang ngực", "HRCT", "CRP", "Culture đờm"),
                "Trung bình",
                "Kháng sinh thích hợp, Hỗ trợ hô hấp"
        ));

        kb.put("thuyên_tắc_phổi", new MedicalCondition(
                "Thuyên tắc phổi",
                Arrays.asList("thở gấp đột ngột", "đau ngực dữ dội", "ho ra máu"),
                Arrays.asList("huyết khối tĩnh mạch", "bất động lâu", "ung thư"),
                Arrays.asList("D-dimer", "CTPA", "V/Q scan"),
                "Rất cao - Cấp cứu",
                "Anticoagulation, Thrombolysis"
        ));

        // Tiêu hóa
        kb.put("viêm_ruột_thừa", new MedicalCondition(
                "Viêm ruột thừa",
                Arrays.asList("đau bụng hố chậu phải", "buồn nôn", "sốt nhẹ"),
                Arrays.asList("tắc ruột thừa", "nhiễm khuẩn"),
                Arrays.asList("CT ổ bụng", "Siêu âm", "WBC"),
                "Cao - Phẫu thuật",
                "Phẫu thuật cắt ruột thừa"
        ));

        kb.put("viêm_tụy", new MedicalCondition(
                "Viêm tụy cấp",
                Arrays.asList("đau bụng thượng vị dữ dội", "buồn nôn", "sốt"),
                Arrays.asList("sỏi mật", "rượu", "tăng mỡ máu"),
                Arrays.asList("Lipase", "Amylase", "CT ổ bụng"),
                "Cao",
                "Kiêng ăn, Giảm đau, Dịch truyền"
        ));

        // Thần kinh
        kb.put("đột_quỵ", new MedicalCondition(
                "Đột quỵ",
                Arrays.asList("liệt nửa người", "nói khó", "mặt lệch"),
                Arrays.asList("tắc mạch", "vỡ mạch", "tăng huyết áp"),
                Arrays.asList("CT não", "MRI", "CTA"),
                "Rất cao - Cấp cứu",
                "tPA trong 4.5h, Thrombectomy"
        ));

        return kb;
    }

    private Map<String, List<String>> initializeSymptomGroups() {
        Map<String, List<String>> groups = new HashMap<>();

        groups.put("tim_mạch", Arrays.asList(
                "đau ngực", "khó thở", "hồi hộp", "phù chân", "choáng váng"
        ));

        groups.put("hô_hấp", Arrays.asList(
                "ho", "khó thở", "thở khò khè", "thở gấp", "ho ra máu"
        ));

        groups.put("tiêu_hóa", Arrays.asList(
                "đau bụng", "buồn nôn", "nôn", "tiêu chảy", "táo bón"
        ));

        groups.put("thần_kinh", Arrays.asList(
                "đau đầu", "chóng mặt", "co giật", "tê liệt", "yếu cơ"
        ));

        return groups;
    }

    private Map<String, DiagnosticInfo> initializeDiagnosticDatabase() {
        Map<String, DiagnosticInfo> db = new HashMap<>();

        db.put("x_quang_ngực", new DiagnosticInfo(
                "X-quang ngực",
                Arrays.asList("ho", "khó thở", "đau ngực", "sốt"),
                "Đám mờ phế nang, khí thũng, tràn dịch",
                "Viêm phổi, COPD, suy tim"
        ));

        db.put("ct_ngực", new DiagnosticInfo(
                "CT ngực",
                Arrays.asList("khó thở cấp", "nghi thuyên tắc", "nốt phổi"),
                "Thuyên tắc phổi, nốt phổi, kính mờ",
                "PE, ung thư phổi, COVID-19"
        ));

        return db;
    }

    private Map<String, ImagingPattern> initializeImagingPatterns() {
        Map<String, ImagingPattern> patterns = new HashMap<>();

        patterns.put("đám_mờ_phế_nang", new ImagingPattern(
                "CT ngực",
                "Đám mờ phế nang lan tỏa",
                Arrays.asList("Viêm phổi vi khuẩn", "Viêm phổi virus", "Lao phổi"),
                "Trung bình - Cao"
        ));

        patterns.put("lấp_đầy_mạch", new ImagingPattern(
                "CTPA",
                "Lấp đầy mạch máu phổi",
                Arrays.asList("Thuyên tắc phổi"),
                "Rất cao - Cấp cứu"
        ));

        return patterns;
    }

    public String getChatResponse(String message) {
        return getChatResponse(message, "doctor_session");
    }

    public String getChatResponse(String message, String sessionId) {
        // Sử dụng OpenAI nếu có API key
        if (openaiApiKey != null && !openaiApiKey.trim().isEmpty() &&
                !openaiApiKey.equals("your-openai-api-key-here")) {
            try {
                return getMedicalAIResponse(message, sessionId);
            } catch (Exception e) {
                System.err.println("OpenAI API error: " + e.getMessage());
                return getAdvancedMedicalResponse(message);
            }
        }

        return getAdvancedMedicalResponse(message);
    }

    private String getMedicalAIResponse(String message, String sessionId) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo");

            List<Map<String, String>> messages = new ArrayList<>();

            Map<String, String> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content",
                    "Bạn là AI chuyên khoa y tế hỗ trợ bác sĩ tại bệnh viện AIDIMS. " +
                            "Hãy trả lời chính xác, có cấu trúc với chẩn đoán phân biệt, " +
                            "khuyến nghị xét nghiệm và phân tầng mức độ nguy hiểm bằng tiếng Việt."
            );

            Map<String, String> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", message);

            messages.add(systemMessage);
            messages.add(userMessage);

            requestBody.put("messages", messages);
            requestBody.put("max_tokens", 1000);
            requestBody.put("temperature", 0.3);

            String responseBody = webClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + openaiApiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(30))
                    .block();

            JsonNode jsonResponse = objectMapper.readTree(responseBody);
            return jsonResponse.get("choices").get(0).get("message").get("content").asText();

        } catch (Exception e) {
            throw new RuntimeException("Lỗi kết nối AI: " + e.getMessage());
        }
    }

    private String getAdvancedMedicalResponse(String message) {
        String lowerMessage = message.toLowerCase().trim();

        // Phân tích ngữ cảnh
        String context = analyzeMedicalContext(lowerMessage);
        List<String> symptoms = detectSymptoms(lowerMessage);
        String urgency = assessUrgency(lowerMessage, symptoms);

        // Xử lý theo ngữ cảnh
        switch (context) {
            case "emergency":
                return handleEmergency(message, symptoms);
            case "cardiology":
                return handleCardiology(message, symptoms);
            case "pulmonology":
                return handlePulmonology(message, symptoms);
            case "gastroenterology":
                return handleGastroenterology(message, symptoms);
            case "neurology":
                return handleNeurology(message, symptoms);
            case "imaging":
                return handleImaging(message);
            case "laboratory":
                return handleLaboratory(message);
            default:
                return handleGeneral(message, symptoms, urgency);
        }
    }

    private String analyzeMedicalContext(String message) {
        if (containsAny(message, "cấp cứu", "emergency", "đột ngột", "dữ dội")) {
            return "emergency";
        }
        if (containsAny(message, "đau ngực", "tim", "mạch vành", "ecg")) {
            return "cardiology";
        }
        if (containsAny(message, "ho", "khó thở", "phổi", "x-quang ngực")) {
            return "pulmonology";
        }
        if (containsAny(message, "đau bụng", "nôn", "gan", "mật")) {
            return "gastroenterology";
        }
        if (containsAny(message, "đau đầu", "liệt", "ct não")) {
            return "neurology";
        }
        if (containsAny(message, "ct", "x-quang", "mri", "dicom")) {
            return "imaging";
        }
        if (containsAny(message, "xét nghiệm", "troponin", "crp")) {
            return "laboratory";
        }
        return "general";
    }

    private List<String> detectSymptoms(String message) {
        List<String> detected = new ArrayList<>();
        for (List<String> groupSymptoms : symptomGroups.values()) {
            for (String symptom : groupSymptoms) {
                if (message.contains(symptom)) {
                    detected.add(symptom);
                }
            }
        }
        return detected;
    }

    private String assessUrgency(String message, List<String> symptoms) {
        if (containsAny(message, "đột ngột", "dữ dội", "ngất", "co giật")) {
            return "RẤT CAO - CẤP CỨU";
        }
        if (symptoms.size() >= 2) {
            return "CAO";
        }
        return "TRUNG BÌNH";
    }

    private String handleEmergency(String original, List<String> symptoms) {
        return "🚨 **ĐÁNH GIÁ CẤP CỨU**\n\n" +
                "**Triệu chứng:** " + String.join(", ", symptoms) + "\n\n" +
                "⚡ **CHẨN ĐOÁN NGUY HIỂM CẦN LOẠI TRỪ:**\n" +
                "• Nhồi máu cơ tim: ECG, Troponin\n" +
                "• Thuyên tắc phổi: D-dimer, CTPA\n" +
                "• Đột quỵ: CT não, glucose\n" +
                "• Viêm ruột thừa: CT bụng, WBC\n\n" +
                "🔍 **XÉT NGHIỆM KHẨN:**\n" +
                "• ABC, glucose, creatinine\n" +
                "• ECG 12 chuyển đạo\n" +
                "• X-quang ngực\n\n" +
                "📞 **Hội chẩn ngay với chuyên khoa**";
    }

    private String handleCardiology(String original, List<String> symptoms) {
        StringBuilder response = new StringBuilder("❤️ **ĐÁNH GIÁ TIM MẠCH**\n\n");

        if (original.toLowerCase().contains("đau ngực")) {
            MedicalCondition condition = medicalKnowledgeBase.get("đau_ngực");
            response.append("🔍 **CHẨN ĐOÁN PHÂN BIỆT:**\n");
            response.append("• Nguyên nhân: ").append(String.join(", ", condition.causes)).append("\n");
            response.append("• Xét nghiệm: ").append(String.join(", ", condition.diagnostics)).append("\n\n");
        }

        response.append("📊 **XÉT NGHIỆM KHUYẾN NGHỊ:**\n");
        response.append("• ECG, Troponin, CK-MB\n");
        response.append("• Echo tim, Stress test\n");
        response.append("• CT mạch vành nếu cần\n");

        return response.toString();
    }

    private String handlePulmonology(String original, List<String> symptoms) {
        StringBuilder response = new StringBuilder("🫁 **ĐÁNH GIÁ HÔ HẤP**\n\n");

        if (original.toLowerCase().contains("ho")) {
            response.append("🦠 **PHÂN TÍCH HO:**\n");
            response.append("• Ho khan: Dị ứng, GERD\n");
            response.append("• Ho có đờm: Nhiễm trùng\n");
            response.append("• Ho ra máu: CẦN KHÁM NGAY\n\n");
        }

        response.append("📋 **HÌNH ẢNH DICOM:**\n");
        response.append("• X-quang ngực: Đám mờ, khí thũng\n");
        response.append("• CT ngực: Ground glass, consolidation\n");
        response.append("• CTPA: Thuyên tắc phổi\n");

        return response.toString();
    }

    private String handleGastroenterology(String original, List<String> symptoms) {
        return "🫃 **ĐÁNH GIÁ TIÊU HÓA**\n\n" +
                "🔍 **PHÂN TÍCH ĐAU BỤNG:**\n" +
                "• Hố chậu phải: Viêm ruột thừa\n" +
                "• Thượng vị: Viêm tụy, GERD\n" +
                "• Hypochondrium phải: Sỏi mật\n\n" +
                "📊 **XÉT NGHIỆM:**\n" +
                "• WBC, CRP, Lipase\n" +
                "• CT ổ bụng có contrast\n" +
                "• MRCP nếu nghi sỏi mật";
    }

    private String handleNeurology(String original, List<String> symptoms) {
        return "🧠 **ĐÁNH GIÁ THẦN KINH**\n\n" +
                "🤕 **PHÂN LOẠI ĐAU ĐẦU:**\n" +
                "• Nguyên phát: Migraine, Tension\n" +
                "• Thứ phát: Trauma, Tumor\n\n" +
                "🚨 **ĐỘT QUỴ CẤP:**\n" +
                "• FAST Scale đánh giá\n" +
                "• CT não loại trừ chảy máu\n" +
                "• tPA trong 4.5h\n";
    }

    private String handleImaging(String original) {
        return "📸 **PHÂN TÍCH HÌNH ẢNH**\n\n" +
                "🫁 **X-QUANG NGỰC:**\n" +
                "• Đám mờ phế nang: Viêm phổi\n" +
                "• Khí thũng: COPD\n" +
                "• Cardiomegaly: Suy tim\n\n" +
                "🔍 **CT PATTERNS:**\n" +
                "• Ground glass: COVID-19, PCP\n" +
                "• Consolidation: Bacterial pneumonia\n" +
                "• Tree-in-bud: Infection\n";
    }

    private String handleLaboratory(String original) {
        return "🔬 **PHÂN TÍCH XÉT NGHIỆM**\n\n" +
                "❤️ **CARDIAC MARKERS:**\n" +
                "• Troponin >0.04: Nhồi máu\n" +
                "• BNP >400: Suy tim\n" +
                "• D-dimer >500: VTE screening\n\n" +
                "🔥 **INFLAMMATORY:**\n" +
                "• CRP >100: Nhiễm trùng nặng\n" +
                "• PCT >0.25: Vi khuẩn\n";
    }

    private String handleGeneral(String original, List<String> symptoms, String urgency) {
        return "🩺 **PHÂN TÍCH TỔNG HỢP**\n\n" +
                "**Câu hỏi:** " + original + "\n" +
                "**Mức độ:** " + urgency + "\n\n" +
                "🔍 **TRIỆU CHỨNG:** " + String.join(", ", symptoms) + "\n\n" +
                "📋 **KHUYẾN NGHỊ:**\n" +
                "• Anamnesis chi tiết\n" +
                "• Physical exam\n" +
                "• Basic workup: CBC, CMP\n" +
                "• Advanced imaging nếu cần\n\n" +
                "📞 **Follow-up 24-48h**";
    }

    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                return true;
            }
        }
        return false;
    }
}