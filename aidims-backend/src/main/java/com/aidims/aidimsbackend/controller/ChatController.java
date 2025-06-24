package com.aidims.aidimsbackend.controller;

import com.aidims.aidimsbackend.dto.ChatRequest;
import com.aidims.aidimsbackend.dto.ChatResponse;
import com.aidims.aidimsbackend.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"})
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    private ChatService chatService;

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