package com.aidims.aidimsbackend.dto;

import java.util.List;

public class ImageAnalysisRequest {
    private String message;
    private List<ImageData> images;
    private String analysisType;

    public ImageAnalysisRequest() {}

    public ImageAnalysisRequest(String message, List<ImageData> images, String analysisType) {
        this.message = message;
        this.images = images;
        this.analysisType = analysisType;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<ImageData> getImages() {
        return images;
    }

    public void setImages(List<ImageData> images) {
        this.images = images;
    }

    public String getAnalysisType() {
        return analysisType;
    }

    public void setAnalysisType(String analysisType) {
        this.analysisType = analysisType;
    }

    public static class ImageData {
        private String name;
        private String type;
        private long size;
        private String data; // Base64 encoded image data

        public ImageData() {}

        public ImageData(String name, String type, long size, String data) {
            this.name = name;
            this.type = type;
            this.size = size;
            this.data = data;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public long getSize() {
            return size;
        }

        public void setSize(long size) {
            this.size = size;
        }

        public String getData() {
            return data;
        }

        public void setData(String data) {
            this.data = data;
        }
    }
}