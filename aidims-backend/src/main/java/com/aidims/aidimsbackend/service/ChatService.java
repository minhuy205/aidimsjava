package com.aidims.aidimsbackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.*;

@Service
public class ChatService {

    @Value("${openai.api.key:}")
    private String openaiApiKey;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    // Lưu trữ lịch sử conversation để context tốt hơn
    private final Map<String, List<Map<String, String>>> conversationHistory = new HashMap<>();

    public ChatService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(1024 * 1024))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public String getChatResponse(String message) {
        return getChatResponse(message, "default");
    }

    public String getChatResponse(String message, String conversationId) {
        // Nếu có OpenAI API key, sử dụng GPT
        if (openaiApiKey != null && !openaiApiKey.trim().isEmpty() && !openaiApiKey.equals("your-openai-api-key-here")) {
            try {
                return getOpenAIResponse(message, conversationId);
            } catch (Exception e) {
                System.err.println("OpenAI API error: " + e.getMessage());
                // Fallback to intelligent local response
                return getIntelligentLocalResponse(message);
            }
        }

        // Nếu không có API key, sử dụng AI local thông minh
        return getIntelligentLocalResponse(message);
    }

    private String getOpenAIResponse(String message, String conversationId) {
        try {
            // Lấy lịch sử conversation
            List<Map<String, String>> messages = conversationHistory.getOrDefault(conversationId, new ArrayList<>());

            // Nếu là conversation mới, thêm system message
            if (messages.isEmpty()) {
                Map<String, String> systemMessage = new HashMap<>();
                systemMessage.put("role", "system");
                systemMessage.put("content",
                        "Bạn là trợ lý AI thông minh trong hệ thống quản lý bệnh viện AIDIMS tại Việt Nam. " +
                                "Hãy trả lời mọi câu hỏi một cách:\n" +
                                "- Thân thiện, chuyên nghiệp\n" +
                                "- Chính xác về mặt y tế\n" +
                                "- Phù hợp với văn hóa Việt Nam\n" +
                                "- Luôn khuyến khích tham khảo bác sĩ khi cần\n" +
                                "- Trả lời bằng tiếng Việt\n" +
                                "- Có thể trả lời về: triệu chứng bệnh, tư vấn sức khỏe, hướng dẫn sử dụng hệ thống bệnh viện, thông tin y tế tổng quát\n" +
                                "- Luôn đưa ra lời khuyên an toàn và có trách nhiệm"
                );
                messages.add(systemMessage);
            }

            // Thêm tin nhắn của user
            Map<String, String> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", message);
            messages.add(userMessage);

            // Giới hạn lịch sử conversation (giữ system + 10 tin nhắn gần nhất)
            if (messages.size() > 21) { // system + 20 messages
                List<Map<String, String>> trimmed = new ArrayList<>();
                trimmed.add(messages.get(0)); // Keep system message
                trimmed.addAll(messages.subList(messages.size() - 20, messages.size()));
                messages = trimmed;
            }

            // Tạo request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo");
            requestBody.put("messages", messages);
            requestBody.put("max_tokens", 800);
            requestBody.put("temperature", 0.7);
            requestBody.put("top_p", 0.9);
            requestBody.put("frequency_penalty", 0.1);
            requestBody.put("presence_penalty", 0.1);

            // Gọi OpenAI API
            String responseBody = webClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + openaiApiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(30))
                    .block();

            // Parse response
            JsonNode jsonResponse = objectMapper.readTree(responseBody);
            String aiResponse = jsonResponse.get("choices").get(0).get("message").get("content").asText();

            // Thêm response của AI vào lịch sử
            Map<String, String> assistantMessage = new HashMap<>();
            assistantMessage.put("role", "assistant");
            assistantMessage.put("content", aiResponse);
            messages.add(assistantMessage);

            // Lưu lịch sử conversation
            conversationHistory.put(conversationId, messages);

            return aiResponse;

        } catch (WebClientResponseException e) {
            System.err.println("OpenAI API HTTP error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            throw new RuntimeException("Lỗi kết nối với OpenAI API: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("OpenAI API error: " + e.getMessage());
            throw new RuntimeException("Lỗi xử lý yêu cầu: " + e.getMessage());
        }
    }

    private String getIntelligentLocalResponse(String message) {
        String lowerMessage = message.toLowerCase().trim();

        // Xử lý câu hỏi về triệu chứng cụ thể
        if (containsAny(lowerMessage, "sốt", "nóng", "fever")) {
            if (containsAny(lowerMessage, "cao", "nhiều", "liên tục", "không hạ")) {
                return "Sốt cao là triệu chứng nghiêm trọng cần được quan tâm:\n\n" +
                        "🌡️ **Mức độ sốt:**\n" +
                        "• 37.5-38°C: Sốt nhẹ\n" +
                        "• 38-39°C: Sốt vừa\n" +
                        "• >39°C: Sốt cao - cần can thiệp ngay\n\n" +
                        "⚠️ **Dấu hiệu nguy hiểm:**\n" +
                        "• Sốt >39°C kéo dài >3 ngày\n" +
                        "• Kèm khó thở, đau ngực\n" +
                        "• Buồn nôn, nôn liên tục\n" +
                        "• Da tái xanh, co giật\n\n" +
                        "🏥 **Hành động:**\n" +
                        "• Đến bệnh viện NGAY nếu có dấu hiệu nguy hiểm\n" +
                        "• Uống nhiều nước, nghỉ ngơi\n" +
                        "• Không tự ý dùng thuốc hạ sốt liều cao\n\n" +
                        "📞 Cấp cứu: (028) 1234-5678";
            }
            return "Sốt là phản ứng tự nhiên của cơ thể chống lại nhiễm trùng:\n\n" +
                    "🌡️ **Nguyên nhân thường gặp:**\n" +
                    "• Nhiễm virus (cảm, cúm)\n" +
                    "• Nhiễm khuẩn\n" +
                    "• Phản ứng vaccine\n" +
                    "• Stress, mệt mỏi\n\n" +
                    "💊 **Chăm sóc tại nhà:**\n" +
                    "• Uống nhiều nước (2-3 lít/ngày)\n" +
                    "• Nghỉ ngơi đầy đủ\n" +
                    "• Chườm mát trán, nách\n" +
                    "• Mặc quần áo thoáng mát\n\n" +
                    "🚨 **Khi nào cần đến viện:**\n" +
                    "• Sốt >38.5°C kéo dài >2 ngày\n" +
                    "• Kèm triệu chứng khác: khó thở, đau ngực, nôn\n\n" +
                    "Bạn có triệu chứng kèm theo nào khác không?";
        }

        if (containsAny(lowerMessage, "đau đầu", "nhức đầu", "headache", "đầu")) {
            if (containsAny(lowerMessage, "dữ dội", "nhiều", "không chịu nổi", "migraine")) {
                return "Đau đầu dữ dội cần được đánh giá cẩn thận:\n\n" +
                        "🧠 **Các loại đau đầu:**\n" +
                        "• **Migraine:** Đau một bên, nhức nhối, sợ ánh sáng\n" +
                        "• **Đau đầu căng thẳng:** Đau tức, như bị siết chặt\n" +
                        "• **Đau đầu cluster:** Đau quanh mắt, rất dữ dội\n\n" +
                        "⚠️ **Dấu hiệu cảnh báo:**\n" +
                        "• Đau đầu đột ngột, dữ dội nhất từng có\n" +
                        "• Kèm sốt, cứng gáy\n" +
                        "• Thay đổi thị lực, nói khó\n" +
                        "• Yếu liệt tay chân\n\n" +
                        "🏥 **Cần khám ngay nếu:**\n" +
                        "• Đau đầu thay đổi đột ngột về tính chất\n" +
                        "• Kèm nôn không rõ nguyên nhân\n" +
                        "• Đau đầu sau chấn thương\n\n" +
                        "📞 Đặt lịch khám: (028) 1234-5678";
            }
            return "Đau đầu là triệu chứng phổ biến với nhiều nguyên nhân:\n\n" +
                    "🎯 **Nguyên nhân thường gặp:**\n" +
                    "• Căng thẳng, stress công việc\n" +
                    "• Thiếu ngủ, ngủ không đều\n" +
                    "• Mất nước, không ăn uống đủ\n" +
                    "• Ngồi sai tư thế lâu\n" +
                    "• Thay đổi thời tiết\n\n" +
                    "💆 **Cách giảm đau tự nhiên:**\n" +
                    "• Massage nhẹ vùng thái dương\n" +
                    "• Nghỉ ngơi trong phòng tối, yên tĩnh\n" +
                    "• Chườm lạnh hoặc ấm (tùy cảm giác)\n" +
                    "• Thở sâu, thư giãn\n" +
                    "• Uống đủ nước\n\n" +
                    "🚨 **Cần khám bác sĩ khi:**\n" +
                    "• Đau đầu thường xuyên (>2 lần/tuần)\n" +
                    "• Đau đầu kèm sốt, buồn nôn\n" +
                    "• Thuốc giảm đau không hiệu quả\n\n" +
                    "Đau đầu của bạn có kèm triệu chứng nào khác không?";
        }

        if (containsAny(lowerMessage, "ho", "cough", "cảm", "cold")) {
            if (containsAny(lowerMessage, "có đờm", "có máu", "khó thở", "đêm")) {
                return "Ho có đờm/máu hoặc kèm khó thở là triệu chứng cần quan tâm:\n\n" +
                        "🫁 **Phân loại ho:**\n" +
                        "• **Ho khan:** Không có đờm, thường do dị ứng\n" +
                        "• **Ho có đờm:** Có thể do nhiễm trùng\n" +
                        "• **Ho có máu:** CẦN KHÁM NGAY\n\n" +
                        "⚠️ **Dấu hiệu nguy hiểm:**\n" +
                        "• Ho ra máu (dù ít)\n" +
                        "• Khó thở khi nghỉ ngơi\n" +
                        "• Ho kéo dài >3 tuần\n" +
                        "• Sụt cân không rõ nguyên nhân\n\n" +
                        "🏥 **Cần đến viện ngay:**\n" +
                        "• Ho có máu tươi\n" +
                        "• Khó thở tăng dần\n" +
                        "• Đau ngực khi thở\n" +
                        "• Sốt cao kèm ho\n\n" +
                        "📞 Cấp cứu 24/7: (028) 1234-5678\n\n" +
                        "Tôi khuyên bạn nên đến khám để được kiểm tra kỹ hơn.";
            }
            return "Ho và cảm lạnh là những vấn đề sức khỏe thường gặp:\n\n" +
                    "🦠 **Nguyên nhân phổ biến:**\n" +
                    "• Virus cảm lạnh thông thường\n" +
                    "• Dị ứng phấn hoa, bụi\n" +
                    "• Thay đổi thời tiết đột ngột\n" +
                    "• Không khí khô, ô nhiễm\n\n" +
                    "🍵 **Chăm sóc tại nhà:**\n" +
                    "• Uống nhiều nước ấm (trà gừng, mật ong)\n" +
                    "• Súc miệng nước muối sinh lý\n" +
                    "• Giữ ấm cơ thể, đặc biệt cổ họng\n" +
                    "• Nghỉ ngơi đầy đủ\n" +
                    "• Tránh khói thuốc, bụi\n\n" +
                    "🚨 **Khi nào cần khám:**\n" +
                    "• Ho kéo dài >10 ngày\n" +
                    "• Sốt cao kèm ho\n" +
                    "• Khó thở, đau ngực\n" +
                    "• Ho có đờm vàng xanh\n\n" +
                    "Triệu chứng của bạn đã kéo dài bao lâu rồi?";
        }

        // Câu hỏi về đặt lịch và thủ tục
        if (containsAny(lowerMessage, "đặt lịch", "hẹn", "appointment", "khám")) {
            return "Đặt lịch khám bệnh tại AIDIMS rất đơn giản:\n\n" +
                    "📱 **3 cách đặt lịch:**\n" +
                    "1. **Online:** Website aidims.com → 'Đặt lịch khám'\n" +
                    "2. **Điện thoại:** (028) 1234-5678 (7:00-17:00)\n" +
                    "3. **Trực tiếp:** Quầy tiếp nhận tầng 1\n\n" +
                    "📋 **Cần chuẩn bị:**\n" +
                    "• CMND/CCCD\n" +
                    "• Thẻ BHYT (nếu có)\n" +
                    "• Hồ sơ bệnh án cũ (nếu có)\n" +
                    "• Danh sách thuốc đang dùng\n\n" +
                    "⏰ **Giờ làm việc:**\n" +
                    "• Thứ 2-6: 7:00 - 17:00\n" +
                    "• Thứ 7: 7:00 - 12:00\n" +
                    "• Cấp cứu: 24/7\n\n" +
                    "💡 **Lưu ý:** Đến trước 15 phút để làm thủ tục\n\n" +
                    "Bạn muốn đặt lịch khám chuyên khoa nào?";
        }

        // Câu hỏi về chi phí
        if (containsAny(lowerMessage, "chi phí", "giá", "tiền", "cost", "price")) {
            return "Bảng chi phí khám bệnh tại AIDIMS:\n\n" +
                    "💰 **Phí khám:**\n" +
                    "• Khám tổng quát: 200,000đ\n" +
                    "• Chuyên khoa tim mạch: 350,000đ\n" +
                    "• Chuyên khoa thần kinh: 350,000đ\n" +
                    "• Chuyên khoa tiêu hóa: 300,000đ\n" +
                    "• Khám nhi: 250,000đ\n\n" +
                    "🎫 **Bảo hiểm y tế:**\n" +
                    "• BHYT hỗ trợ 80% chi phí\n" +
                    "• Thẻ vàng: Miễn phí hoàn toàn\n" +
                    "• Người cao tuổi >70: Giảm 20%\n\n" +
                    "📊 **Dịch vụ thêm:**\n" +
                    "• Xét nghiệm máu: 150,000-500,000đ\n" +
                    "• Siêu âm: 200,000-400,000đ\n" +
                    "• X-quang: 180,000-300,000đ\n" +
                    "• CT scan: 1,200,000-2,500,000đ\n\n" +
                    "📞 Chi tiết: Phòng tài chính (028) 1234-5679\n\n" +
                    "Bạn có thẻ BHYT không?";
        }

        // Xử lý câu chào hỏi
        if (containsAny(lowerMessage, "xin chào", "chào", "hello", "hi")) {
            return "Xin chào và chào mừng bạn đến với AIDIMS! 🏥\n\n" +
                    "Tôi là trợ lý AI thông minh, sẵn sàng hỗ trợ bạn 24/7 về:\n\n" +
                    "🩺 **Tư vấn y tế:**\n" +
                    "• Giải đáp triệu chứng bệnh\n" +
                    "• Hướng dẫn chăm sóc sức khỏe\n" +
                    "• Tư vấn dinh dưỡng cơ bản\n\n" +
                    "🏥 **Dịch vụ bệnh viện:**\n" +
                    "• Đặt lịch khám bệnh\n" +
                    "• Thông tin chi phí, bảo hiểm\n" +
                    "• Hướng dẫn thủ tục\n\n" +
                    "📍 **Thông tin liên hệ:**\n" +
                    "• Địa chỉ: 123 Đường ABC, TP.HCM\n" +
                    "• Tổng đài: (028) 1234-5678\n" +
                    "• Website: aidims.com\n\n" +
                    "Hôm nay tôi có thể giúp gì cho bạn? 😊";
        }

        // Câu cảm ơn
        if (containsAny(lowerMessage, "cảm ơn", "thanks", "thank you", "cám ơn")) {
            return "Rất vui được hỗ trợ bạn! 🙏\n\n" +
                    "Sức khỏe là tài sản quý giá nhất, đừng ngần ngại liên hệ với chúng tôi bất cứ khi nào cần thiết.\n\n" +
                    "💙 **Lời nhắn từ AIDIMS:**\n" +
                    "\"Chúng tôi luôn đồng hành cùng sức khỏe của bạn và gia đình\"\n\n" +
                    "📞 Cần hỗ trợ khẩn cấp: (028) 1234-5678\n" +
                    "🌐 Website: aidims.com\n\n" +
                    "Chúc bạn và gia đình luôn mạnh khỏe! 🌟";
        }

        // Response mặc định thông minh
        return String.format("Cảm ơn bạn đã chia sẻ: \"%s\"\n\n" +
                        "Tôi hiểu bạn đang quan tâm về vấn đề này. Để đưa ra tư vấn chính xác và an toàn nhất:\n\n" +
                        "🔍 **Bạn có thể mô tả thêm:**\n" +
                        "• Triệu chứng cụ thể (nếu có)\n" +
                        "• Thời gian bắt đầu\n" +
                        "• Mức độ nghiêm trọng\n" +
                        "• Các yếu tố liên quan\n\n" +
                        "🏥 **Hoặc liên hệ trực tiếp:**\n" +
                        "• Tổng đài tư vấn: (028) 1234-5678\n" +
                        "• Cấp cứu 24/7: Luôn sẵn sàng\n" +
                        "• Đặt lịch online: aidims.com\n\n" +
                        "💡 **Lưu ý:** Với các vấn đề sức khỏe, việc khám trực tiếp luôn được khuyến khích để có chẩn đoán chính xác nhất.\n\n" +
                        "Bạn có muốn chia sẻ thêm chi tiết để tôi hỗ trợ tốt hơn không?",
                message.length() > 50 ? message.substring(0, 50) + "..." : message);
    }

    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword.toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    // Method để xóa conversation history (có thể dùng cho logout user)
    public void clearConversationHistory(String conversationId) {
        conversationHistory.remove(conversationId);
    }

    // Method để lấy thống kê conversation
    public int getActiveConversations() {
        return conversationHistory.size();
    }
}