package com.aidims.aidimsbackend.dto;

public class UserDto {
    private Long id;
    private String username;
    private String fullName;
    private String role;
    private String email;
    private String phone;
    
    private boolean isActive;
    
    public UserDto(Long id, String username, String fullName, String role, String email, String phone, boolean isActive) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
        this.email = email;
        this.phone = phone;
        this.isActive = isActive;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public boolean isActive() { return isActive; }
    public void setActive(boolean isActive) { this.isActive = isActive; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    
}