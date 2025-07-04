package com.aidims.aidimsbackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Value("${aidims.upload-dir:./dicom_uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        try {
            // Ensure upload directory path is properly formatted
            String location = uploadDir.replace("\\", "/");
            if (!location.endsWith("/")) {
                location += "/";
            }

            // Add static resource handler for direct file access
            // This handles URLs like: /dicom_uploads/filename.png
            registry.addResourceHandler("/dicom_uploads/**")
                    .addResourceLocations("file:" + location)
                    .setCachePeriod(3600);

            System.out.println("✅ Static Resource Handler configured:");
            System.out.println("   URL Pattern: /dicom_uploads/**");
            System.out.println("   Location: file:" + location);
            System.out.println("   Note: This is separate from /api/dicom-viewer/image/** endpoints");

        } catch (Exception e) {
            System.err.println("❌ Error configuring static resources: " + e.getMessage());
            e.printStackTrace();
        }
    }
}