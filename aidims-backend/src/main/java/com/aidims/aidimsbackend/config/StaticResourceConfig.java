package com.aidims.aidimsbackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {
    @Value("${aidims.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Chỉ dùng đường dẫn tương đối, đọc từ application.properties
        String location = uploadDir;
        if (!location.endsWith("/")) location += "/";
        registry.addResourceHandler("/dicom_uploads/**")
                .addResourceLocations("file:" + location);
    }
}
