package com.aidims.aidimsbackend.dto;

import java.util.Map;

public class RegisterResponse {
    private boolean success;
    private String message;
    private Map<String, Object> data;

    public static RegisterResponse success(Map<String, Object> data) {
        RegisterResponse response = new RegisterResponse();
        response.success = true;
        response.message = "Đăng ký thành công";
        response.data = data;
        return response;
    }

    public static RegisterResponse error(String message) {
        RegisterResponse response = new RegisterResponse();
        response.success = false;
        response.message = message;
        return response;
    }

    // Getters
    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public Map<String, Object> getData() { return data; }
}
