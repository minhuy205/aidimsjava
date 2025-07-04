package com.aidims.aidimsbackend.config;

import java.nio.file.Paths;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

     @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String absolutePath = Paths.get("dicom_uploads").toAbsolutePath().toString();
        
        // Add debug logging
        System.out.println("Serving static files from: " + absolutePath);
        
        registry.addResourceHandler("/dicom_uploads/**")
                .addResourceLocations("file:" + absolutePath + "/")
                .setCachePeriod(3600);
    }
}