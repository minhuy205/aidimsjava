package com.aidims.aidimsbackend.dto;

import java.util.Map;

public class LoginResponse {
    private boolean success;
    private String message;
    private Map<String, Object> data;

    public static LoginResponse success(Map<String, Object> data) {
        LoginResponse response = new LoginResponse();
        response.success = true;
        response.message = "Đăng nhập thành công";
        response.data = data;
        return response;
    }

    public static LoginResponse error(String message) {
        LoginResponse response = new LoginResponse();
        response.success = false;
        response.message = message;
        return response;
    }

    // Getters
    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public Map<String, Object> getData() { return data; }
}