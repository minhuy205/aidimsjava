package com.aidims.aidimsbackend.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DicomFileService {

    public void saveAndCopyToFrontend(MultipartFile file) throws IOException {
        // Lưu vào backend
        Path backendDir = Paths.get("dicom_uploads");
        Files.createDirectories(backendDir);
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path backendPath = backendDir.resolve(fileName);
        file.transferTo(backendPath.toFile());

        // Copy sang frontend/public/dicom_uploads
        Path frontendDir = Paths.get("../aidims-frontend/public/dicom_uploads");
        Files.createDirectories(frontendDir);
        Path frontendPath = frontendDir.resolve(fileName);
        Files.copy(backendPath, frontendPath, StandardCopyOption.REPLACE_EXISTING);

        System.out.println("Đã copy sang frontend: " + frontendPath.toAbsolutePath());
    }

    public void copyFileToFrontend(File sourceFile, String fileName) throws IOException {
        Path frontendDir = Paths.get("../aidims-frontend/public/dicom_uploads");
        Files.createDirectories(frontendDir);
        Path frontendPath = frontendDir.resolve(fileName);
        Files.copy(sourceFile.toPath(), frontendPath, StandardCopyOption.REPLACE_EXISTING);
        System.out.println("Đã copy sang frontend: " + frontendPath.toAbsolutePath());
    }
}