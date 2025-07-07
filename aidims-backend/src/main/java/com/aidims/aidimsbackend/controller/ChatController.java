package com.aidims.aidimsbackend.controller;

import com.aidims.aidimsbackend.dto.ChatRequest;
import com.aidims.aidimsbackend.dto.ChatResponse;
import com.aidims.aidimsbackend.dto.ImageAnalysisRequest;
import com.aidims.aidimsbackend.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"})
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    private final ChatService chatService;
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/test-gemini")
    public ResponseEntity<String> testGemini(@RequestParam(defaultValue = "đau ngực") String message) {
        try {
            // Test trực tiếp Gemini API
            String response = chatService.testGeminiDirectly(message);
            return ResponseEntity.ok("✅ Gemini API hoạt động:\n" + response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Gemini API lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/test-connection")
    public ResponseEntity<Map<String, Object>> testConnection() {
        Map<String, Object> result = new HashMap<>();

        // Test Gemini
        try {
            String geminiResponse = chatService.testGeminiDirectly("hello");
            result.put("gemini", "✅ OK");
            result.put("geminiSample", geminiResponse.substring(0, Math.min(100, geminiResponse.length())));
        } catch (Exception e) {
            result.put("gemini", "❌ FAILED: " + e.getMessage());
        }

        // Test OpenAI nếu có
        try {
            String openaiResponse = chatService.testOpenAIDirectly("hello");
            result.put("openai", "✅ OK");
        } catch (Exception e) {
            result.put("openai", "❌ FAILED or NOT CONFIGURED");
        }

        result.put("timestamp", new Date());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/message")
    public ResponseEntity<ChatResponse> sendMessage(@RequestBody ChatRequest request) {
        logger.info("Received chat message: {}", request.getMessage());

        try {
            String response = chatService.getChatResponse(request.getMessage());
            logger.info("Generated response: {}", response);
            return ResponseEntity.ok(new ChatResponse(response, "success"));
        } catch (Exception e) {
            logger.error("Error processing chat message: ", e);
            return ResponseEntity.status(500)
                    .body(new ChatResponse("Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.", "error"));
        }
    }

    @PostMapping("/analyze-image")
    public ResponseEntity<ChatResponse> analyzeImage(@RequestBody ImageAnalysisRequest request) {
        logger.info("Received image analysis request with {} images",
                request.getImages() != null ? request.getImages().size() : 0);

        try {
            if (request.getImages() == null || request.getImages().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ChatResponse("Không có hình ảnh nào được gửi", "error"));
            }

            if (request.getImages().size() > 5) {
                return ResponseEntity.badRequest()
                        .body(new ChatResponse("Tối đa 5 hình ảnh mỗi lần", "error"));
            }

            for (var image : request.getImages()) {
                if (image.getSize() > 10 * 1024 * 1024) {
                    return ResponseEntity.badRequest()
                            .body(new ChatResponse("Hình ảnh " + image.getName() + " quá lớn (>10MB)", "error"));
                }
            }

            String response = chatService.analyzeImages(request);
            logger.info("Generated image analysis response");

            return ResponseEntity.ok(new ChatResponse(response, "success"));

        } catch (Exception e) {
            logger.error("Error analyzing images: ", e);
            return ResponseEntity.status(500)
                    .body(new ChatResponse(
                            "❌ **Lỗi phân tích hình ảnh**\n\n" +
                                    "Không thể phân tích hình ảnh lúc này:\n" +
                                    "• " + e.getMessage() + "\n\n" +
                                    "📞 **Hỗ trợ:** 0777815075",
                            "error"));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        logger.info("Health check called");
        return ResponseEntity.ok("Chatbot service is running at " + java.time.LocalDateTime.now());
    }

    @PostMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        logger.info("Test endpoint called");
        return ResponseEntity.ok("Test successful!");
    }
}