package com.aidims.aidimsbackend.controller;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aidims.aidimsbackend.dto.UserDto;
import com.aidims.aidimsbackend.entity.User;
import com.aidims.aidimsbackend.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
// @CrossOrigin(origins = "http://localhost:3000")



public class UserController {


    @Autowired
    private UserRepository userRepository;

    private static final Map<String, String> ROLE_DISPLAY_NAMES = Map.of(
        "admin", "Quản trị viên",
        "doctor", "Bác sĩ",
        "receptionist", "Nhân viên tiếp nhận",
        "technician", "Kỹ thuật viên"
    );

    @GetMapping
public ResponseEntity<List<UserDto>> getAllUsers() {
    List<UserDto> users = userRepository.findAll()
        .stream()
        .map(user -> {
            String internalRole = user.getRole().getRoleName();
            String displayRole = ROLE_DISPLAY_NAMES.getOrDefault(internalRole, internalRole); // fallback nếu không có
            return new UserDto(
                user.getUserId(),
                user.getUsername(),
                user.getFullName(),
                displayRole,
                user.getEmail(),
                user.isActive()
            );
        })
        .toList();

    return ResponseEntity.ok(users);
}

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("userId", user.getUserId());
            result.put("username", user.getUsername());
            result.put("email", user.getEmail());
            result.put("fullName", user.getFullName());
            result.put("isActive", user.isActive());
            result.put("role", user.getRole().getRoleName()); // Chỉ lấy tên role, tránh đưa nguyên object

            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(404).body(Map.of("error", "Không tìm thấy người dùng"));
    }


    // POST /users - Đăng ký user mới
    @PostMapping
public ResponseEntity<?> createUser(@RequestBody User user) {
    try {
        user.setUserId(null); // tạo mới nên xóa id
        user.setActive(true); // mặc định hoạt động

        User savedUser = userRepository.save(user);

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("userId", savedUser.getUserId());
        data.put("username", savedUser.getUsername());
        data.put("fullName", savedUser.getFullName()); // sửa lại key cho thống nhất với frontend
        data.put("email", savedUser.getEmail());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("message", "Tạo người dùng thành công");
        response.put("data", data);

        return ResponseEntity.ok(response);

    } catch (Exception e) {
        Map<String, Object> error = new LinkedHashMap<>();
        error.put("status", "error");
        error.put("message", "Đã xảy ra lỗi khi tạo người dùng");
        error.put("error", e.getMessage());

        return ResponseEntity.status(500).body(error);
    }
}


    // PUT /users/{id} - Cập nhật user
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> userOpt = userRepository.findById(id);
        System.out.println("Updating user with ID: " + id);
        System.out.println("Updated user details: " + updatedUser);

        Map<String, Object> response = new HashMap<>();

        if (userOpt.isEmpty()) {
            response.put("message", "Không tìm thấy người dùng với ID: " + id);
            response.put("status", "error");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        System.out.println("User found: " + userOpt.get());

        User existingUser = userOpt.get();
        existingUser.setPassword(updatedUser.getPassword());
        existingUser.setFullName(updatedUser.getFullName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPhone(updatedUser.getPhone());

        User savedUser = userRepository.save(existingUser);

        if (savedUser.getRole() != null) {
            savedUser.getRole().setUsers(null); // tránh vòng lặp JSON
        }

        response.put("message", "Cập nhật người dùng thành công");
        response.put("status", "success");
        response.put("data", savedUser);

        return ResponseEntity.ok(response);
    }


    @PatchMapping("/update-status/{id}")
public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
    Optional<User> userOpt = userRepository.findById(id);
    Map<String, Object> response = new HashMap<>();

    if (userOpt.isEmpty()) {
        response.put("message", "Không tìm thấy người dùng");
        response.put("status", "error");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    User user = userOpt.get();
    Boolean isActive = payload.get("isActive");

    if (isActive == null) {
        response.put("message", "Giá trị 'isActive' không hợp lệ");
        response.put("status", "error");
        return ResponseEntity.badRequest().body(response);
    }

    user.setActive(isActive);
    User savedUser = userRepository.save(user);

    // Tránh vòng lặp đệ quy: Xóa danh sách users trong role
    if (savedUser.getRole() != null) {
        savedUser.getRole().setUsers(null);
    }

    Map<String, Object> userData = new LinkedHashMap<>();
    userData.put("userId", savedUser.getUserId());
    userData.put("username", savedUser.getUsername());
    userData.put("fullName", savedUser.getFullName());
    userData.put("email", savedUser.getEmail());
    userData.put("isActive", savedUser.isActive());
    userData.put("role", savedUser.getRole().getRoleName());

    response.put("message", "Cập nhật trạng thái thành công");
    response.put("status", "success");
    response.put("data", userData);

    return ResponseEntity.ok(response);
}






    // DELETE /users/{id} - Xóa user theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);

        if (userOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "User not found with id = " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        userRepository.deleteById(id);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "User deleted successfully");
        response.put("userId", id);

        return ResponseEntity.ok(response);
    }
}
