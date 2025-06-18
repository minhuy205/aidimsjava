package com.aidims.aidimsbackend.dto;

public class LoginResponse {

    private boolean success;
    private String message;
    private Object data;

    // Constructors
    public LoginResponse() {}

    public LoginResponse(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    // Static factory methods
    public static LoginResponse success(Object data) {
        return new LoginResponse(true, "Đăng nhập thành công", data);
    }

    public static LoginResponse error(String msg) {
        return new LoginResponse(false, msg, null);
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    // Optional: toString for logging/debugging
    @Override
    public String toString() {
        return "LoginResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", data=" + data +
                '}';
    }
}
