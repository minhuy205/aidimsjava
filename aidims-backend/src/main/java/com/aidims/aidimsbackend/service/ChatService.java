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
    private final Map<String, String> symptomDiagnosis;
    private final Map<String, String> dicomFindings;

    public ChatService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .build();
        this.objectMapper = new ObjectMapper();
        this.symptomDiagnosis = initializeSymptomDiagnosis();
        this.dicomFindings = initializeDicomFindings();
    }

    private Map<String, String> initializeSymptomDiagnosis() {
        Map<String, String> symptoms = new HashMap<>();

        // Tim mạch
        symptoms.put("đau ngực", "🔍 **ĐÁNH GIÁ:** ACS, PE, Pneumothorax\n📊 **XÉT NGHIỆM:** ECG, Troponin, D-dimer\n🏥 **CẦN KHÁM NGAY**");
        symptoms.put("khó thở", "🔍 **ĐÁNH GIÁ:** Suy tim, PE, Pneumonia\n📊 **XÉT NGHIỆM:** BNP, CXR, CTPA\n⚡ **ƯU TIÊN CAO**");
        symptoms.put("hồi hộp", "🔍 **ĐÁNH GIÁ:** Arrhythmia, Anxiety, Hyperthyroid\n📊 **XÉT NGHIỆM:** ECG, TSH, Echo\n🟡 **THEO DÕI**");
        symptoms.put("phù chân", "🔍 **ĐÁNH GIÁ:** Suy tim, Suy thận, DVT\n📊 **XÉT NGHIỆM:** BNP, Creatinine, Doppler\n🟡 **THEO DÕI**");

        // Hô hấp
        symptoms.put("ho khan", "🔍 **ĐÁNH GIÁ:** GERD, ACE-I, Asthma\n📊 **XÉT NGHIỆM:** CXR, PPI trial\n🟢 **THẤP**");
        symptoms.put("ho có đờm", "🔍 **ĐÁNH GIÁ:** Pneumonia, Bronchitis, COPD\n📊 **XÉT NGHIỆM:** CXR, Sputum culture, CRP\n🟡 **THEO DÕI**");
        symptoms.put("thở khò khè", "🔍 **ĐÁNH GIÁ:** Asthma, COPD, CHF\n📊 **XÉT NGHIỆM:** PFT, CXR, BNP\n🟡 **THEO DỊI**");
        symptoms.put("thở gấp", "🔍 **ĐÁNH GIÁ:** PE, Pneumothorax, MI\n📊 **XÉT NGHIỆM:** ABG, CTPA, ECG\n🔴 **KHẨN CẤP**");
        symptoms.put("ho ra máu", "🔍 **ĐÁNH GIÁ:** TB, Cancer, PE, Bronchiectasis\n📊 **XÉT NGHIỆM:** CT chest, AFB, Bronchoscopy\n🔴 **KHẨN CẤP**");

        // Tiêu hóa
        symptoms.put("đau bụng", "🔍 **ĐÁNH GIÁ:** Appendicitis, Pancreatitis, Gallstones\n📊 **XÉT NGHIỆM:** CT abdomen, Lipase, WBC\n🟡 **THEO DÕI**");
        symptoms.put("buồn nôn", "🔍 **ĐÁNH GIÁ:** Gastritis, Pancreatitis, Pregnancy\n📊 **XÉT NGHIỆM:** βhCG, Lipase, H.pylori\n🟢 **THẤP**");
        symptoms.put("tiêu chảy", "🔍 **ĐÁNH GIÁ:** Gastroenteritis, IBD, C.diff\n📊 **XÉT NGHIỆM:** Stool culture, Calprotectin\n🟡 **THEO DÕI**");
        symptoms.put("táo bón", "🔍 **ĐÁNH GIÁ:** IBS, Medication, Diet\n📊 **XÉT NGHIỆM:** Colonoscopy nếu >50 tuổi\n🟢 **THẤP**");
        symptoms.put("vàng da", "🔍 **ĐÁNH GIÁ:** Hepatitis, Gallstones, Hemolysis\n📊 **XÉT NGHIỆM:** LFT, Bilirubin, MRCP\n🟡 **THEO DÕI**");

        // Thần kinh
        symptoms.put("đau đầu", "🔍 **ĐÁNH GIÁ:** Migraine, Tension, SAH\n📊 **XÉT NGHIỆM:** CT head nếu red flags\n🟡 **THEO DÕI**");
        symptoms.put("chóng mặt", "🔍 **ĐÁNH GIÁ:** BPPV, Orthostatic, Stroke\n📊 **XÉT NGHIỆM:** MRI nếu focal signs\n🟡 **THEO DÕI**");
        symptoms.put("co giật", "🔍 **ĐÁNH GIÁ:** Epilepsy, Metabolic, Infection\n📊 **XÉT NGHIỆM:** EEG, Glucose, CT head\n🔴 **KHẨN CẤP**");
        symptoms.put("tê liệt", "🔍 **ĐÁNH GIÁ:** Stroke, Spinal compression\n📊 **XÉT NGHIỆM:** CT/MRI brain/spine\n🔴 **KHẨN CẤP**");
        symptoms.put("yếu cơ", "🔍 **ĐÁNH GIÁ:** Myopathy, Neuropathy, MG\n📊 **XÉT NGHIỆM:** CK, EMG, AChR Ab\n🟡 **THEO DÕI**");

        // Khác
        symptoms.put("sốt", "🔍 **ĐÁNH GIÁ:** Infection, Autoimmune, Malignancy\n📊 **XÉT NGHIỆM:** CBC, Blood culture, CRP\n🟡 **THEO DÕI**");
        symptoms.put("sút cân", "🔍 **ĐÁNH GIÁ:** Cancer, Hyperthyroid, Depression\n📊 **XÉT NGHIỆM:** CT chest/abdomen, TSH\n🟡 **THEO DÕI**");
        symptoms.put("mệt mỏi", "🔍 **ĐÁNH GIÁ:** Anemia, Thyroid, Depression\n📊 **XÉT NGHIỆM:** CBC, TSH, Vitamin B12\n🟢 **THẤP**");

        return symptoms;
    }

    private Map<String, String> initializeDicomFindings() {
        Map<String, String> findings = new HashMap<>();

        // CT Chest patterns
        findings.put("ground glass", "🫁 **Ground Glass Opacity:**\nCOVID-19, PCP, Drug toxicity\n**Phân bố:** Peripheral (COVID), Central (PCP)");
        findings.put("consolidation", "🫁 **Consolidation:**\nBacterial pneumonia, Aspiration\n**Đặc điểm:** Air bronchograms, lobar");
        findings.put("cavitary", "🫁 **Cavitary lesion:**\nTB (upper lobe), Cancer (thick wall), Abscess\n**Wall >4mm:** Nghi ngờ malignancy");
        findings.put("honeycombing", "🫁 **Honeycombing:**\nIPF, End-stage fibrosis\n**Vị trí:** Subpleural, bilateral lower");
        findings.put("tree in bud", "🫁 **Tree-in-bud:**\nInfection, Aspiration\n**Phân bố:** Centrilobular nodules");
        findings.put("pneumothorax", "🫁 **Pneumothorax:**\n>20% cần chest tube\n**Tension:** Emergency decompression");
        findings.put("pleural effusion", "🫁 **Pleural effusion:**\nHeart failure, Infection, Malignancy\n**Bilateral:** CHF. **Unilateral:** Infection/Cancer");
        findings.put("pulmonary embolism", "🫁 **Pulmonary embolism:**\nFilling defect, RV strain\n**Massive:** Shock, thrombolysis");

        // CT Abdomen patterns
        findings.put("appendicitis", "🫃 **Appendicitis:**\nWall thickening >6mm, fat stranding\n**Perforated:** Free fluid, abscess");
        findings.put("pancreatitis", "🫃 **Pancreatitis:**\nPancreatic enlargement, fat stranding\n**Severe:** Necrosis, fluid collections");
        findings.put("gallstones", "🫃 **Gallstones:**\nHyperdense stones, wall thickening\n**Complications:** Cholangitis, pancreatitis");
        findings.put("bowel obstruction", "🫃 **Bowel obstruction:**\nDilated loops, air-fluid levels\n**Strangulation:** Ischemia, surgery");
        findings.put("free air", "🫃 **Pneumoperitoneum:**\nPerforated viscus\n**Emergency surgery** indicated");
        findings.put("liver lesion", "🫃 **Liver lesion:**\nHCC, Metastases, Hemangioma\n**Enhancement pattern** key");

        // CT Brain patterns
        findings.put("hypodense", "🧠 **Hypodense lesion:**\nIschemic stroke, Edema, Tumor\n**Acute:** <6h invisible on CT");
        findings.put("hyperdense", "🧠 **Hyperdense lesion:**\nAcute hemorrhage, Contrast\n**Subarachnoid:** Aneurysm rupture");
        findings.put("midline shift", "🧠 **Midline shift:**\n>5mm significant mass effect\n**Neurosurgery consult** needed");
        findings.put("hydrocephalus", "🧠 **Hydrocephalus:**\nVentricular enlargement\n**Acute:** Emergent shunt");

        return findings;
    }

    public String getChatResponse(String message) {
        return getChatResponse(message, "default");
    }

    public String getChatResponse(String message, String sessionId) {
        if (openaiApiKey != null && !openaiApiKey.trim().isEmpty() &&
                !openaiApiKey.equals("your-openai-api-key-here")) {
            try {
                return getOpenAIResponse(message);
            } catch (Exception e) {
                return getSymptomAnalysis(message);
            }
        }
        return getSymptomAnalysis(message);
    }

    private String getOpenAIResponse(String message) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo");

            List<Map<String, String>> messages = new ArrayList<>();

            Map<String, String> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content",
                    "Bạn là AI y tế hỗ trợ bác sĩ. Phân tích triệu chứng ngắn gọn:\n" +
                            "- Chẩn đoán phân biệt top 3\n" +
                            "- Xét nghiệm cần làm\n" +
                            "- Mức độ ưu tiên (🔴🟡🟢)\n" +
                            "- DICOM findings nếu có\n" +
                            "Trả lời tối đa 200 từ, bằng tiếng Việt."
            );

            Map<String, String> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", message);

            messages.add(systemMessage);
            messages.add(userMessage);

            requestBody.put("messages", messages);
            requestBody.put("max_tokens", 300);
            requestBody.put("temperature", 0.3);

            String response = webClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + openaiApiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(20))
                    .block();

            JsonNode jsonResponse = objectMapper.readTree(response);
            return jsonResponse.get("choices").get(0).get("message").get("content").asText();

        } catch (Exception e) {
            throw new RuntimeException("Lỗi AI: " + e.getMessage());
        }
    }

    private String getSymptomAnalysis(String message) {
        String lowerMessage = message.toLowerCase().trim();
        List<String> foundSymptoms = new ArrayList<>();
        List<String> foundDicom = new ArrayList<>();

        // Tìm triệu chứng
        for (String symptom : symptomDiagnosis.keySet()) {
            if (lowerMessage.contains(symptom)) {
                foundSymptoms.add(symptom);
            }
        }

        // Tìm DICOM findings
        for (String finding : dicomFindings.keySet()) {
            if (lowerMessage.contains(finding.replace(" ", "")) ||
                    lowerMessage.contains(finding)) {
                foundDicom.add(finding);
            }
        }

        StringBuilder response = new StringBuilder();

        if (!foundSymptoms.isEmpty()) {
            response.append("🩺 **PHÂN TÍCH TRIỆU CHỨNG**\n\n");

            for (String symptom : foundSymptoms) {
                response.append("**").append(symptom.toUpperCase()).append(":**\n");
                response.append(symptomDiagnosis.get(symptom)).append("\n\n");
            }

            // Combination analysis
            if (foundSymptoms.size() > 1) {
                response.append("🔍 **KẾT HỢP TRIỆU CHỨNG:**\n");
                response.append(analyzeCombination(foundSymptoms)).append("\n\n");
            }
        }

        if (!foundDicom.isEmpty()) {
            response.append("📸 **PHÂN TÍCH DICOM**\n\n");

            for (String finding : foundDicom) {
                response.append("**").append(finding.toUpperCase()).append(":**\n");
                response.append(dicomFindings.get(finding)).append("\n\n");
            }
        }

        if (foundSymptoms.isEmpty() && foundDicom.isEmpty()) {
            response.append("🤖 **TƯ VẤN Y TẾ AIDIMS**\n\n");
            response.append("Tôi chưa nhận diện được triệu chứng cụ thể.\n\n");
            response.append("**Cách sử dụng:**\n");
            response.append("• Nhập triệu chứng: \"đau ngực + khó thở\"\n");
            response.append("• DICOM findings: \"ground glass + fever\"\n");
            response.append("• Kết hợp: \"đau bụng + sốt + WBC cao\"\n\n");
            response.append("**Triệu chứng có sẵn:**\n");
            response.append("Tim mạch, Hô hấp, Tiêu hóa, Thần kinh, Nhiễm trùng\n\n");
            response.append("📞 **Tổng đài:** (028) 1234-5678");
        }

        return response.toString();
    }

    private String analyzeCombination(List<String> symptoms) {
        String combo = String.join(" + ", symptoms);

        // Common combinations
        if (symptoms.contains("đau ngực") && symptoms.contains("khó thở")) {
            return "⚡ **ACS vs PE vs Pneumothorax**\nECG + Troponin + D-dimer + CTPA\n🔴 **KHẨN CẤP**";
        }

        if (symptoms.contains("sốt") && symptoms.contains("ho có đờm")) {
            return "🦠 **Pneumonia**\nCXR + Blood culture + CRP + PCT\n🟡 **KHÁNG SINH**";
        }

        if (symptoms.contains("đau bụng") && symptoms.contains("sốt")) {
            return "🫃 **Appendicitis vs Cholecystitis**\nCT abdomen + WBC + Lipase\n🔴 **PHẪU THUẬT?**";
        }

        if (symptoms.contains("đau đầu") && symptoms.contains("sốt")) {
            return "🧠 **Meningitis vs SAH**\nCT head + LP + Blood culture\n🔴 **KHẨN CẤP**";
        }

        if (symptoms.contains("khó thở") && symptoms.contains("phù chân")) {
            return "💧 **Heart Failure**\nBNP + Echo + CXR\n🟡 **NHẬP VIỆN**";
        }

        return "🔍 **Đa triệu chứng:** " + combo + "\n📋 **Cần đánh giá toàn diện**";
    }
}