package com.aidims.aidimsbackend.dto;

public class DicomAnalysisResponse {

    private String analysisText;
    private String dicomImageBase64;   // "data:image/jpeg;base64,..."
    private DicomMetadata metadata;
    private String status;
    private long timestamp;

    public DicomAnalysisResponse() {
        this.timestamp = System.currentTimeMillis();
    }

    public DicomAnalysisResponse(String analysisText,
                                  String dicomImageBase64,
                                  DicomMetadata metadata,
                                  String status) {
        this.analysisText     = analysisText;
        this.dicomImageBase64 = dicomImageBase64;
        this.metadata         = metadata;
        this.status           = status;
        this.timestamp        = System.currentTimeMillis();
    }

    // ── getters / setters ──────────────────────────────────────────────
    public String getAnalysisText()               { return analysisText; }
    public void setAnalysisText(String v)         { this.analysisText = v; }

    public String getDicomImageBase64()           { return dicomImageBase64; }
    public void setDicomImageBase64(String v)     { this.dicomImageBase64 = v; }

    public DicomMetadata getMetadata()            { return metadata; }
    public void setMetadata(DicomMetadata v)      { this.metadata = v; }

    public String getStatus()                     { return status; }
    public void setStatus(String v)               { this.status = v; }

    public long getTimestamp()                    { return timestamp; }
    public void setTimestamp(long v)              { this.timestamp = v; }

    // ── Inner class: DICOM metadata ────────────────────────────────────
    public static class DicomMetadata {
        private String patientId;
        private String patientName;
        private String patientBirthDate;
        private String patientSex;
        private String modality;          // DX, CT, MR, US...
        private String bodyPart;
        private String studyDescription;
        private String seriesDescription;
        private String studyDate;
        private String institutionName;
        private String manufacturer;
        private String imageSize;         // "1024 x 1024"
        private String bitsAllocated;
        private String kvp;               // kV (X-quang)
        private String exposureTime;      // ms
        private String transferSyntax;

        // getters / setters
        public String getPatientId()               { return patientId; }
        public void setPatientId(String v)         { this.patientId = v; }

        public String getPatientName()             { return patientName; }
        public void setPatientName(String v)       { this.patientName = v; }

        public String getPatientBirthDate()        { return patientBirthDate; }
        public void setPatientBirthDate(String v)  { this.patientBirthDate = v; }

        public String getPatientSex()              { return patientSex; }
        public void setPatientSex(String v)        { this.patientSex = v; }

        public String getModality()                { return modality; }
        public void setModality(String v)          { this.modality = v; }

        public String getBodyPart()                { return bodyPart; }
        public void setBodyPart(String v)          { this.bodyPart = v; }

        public String getStudyDescription()        { return studyDescription; }
        public void setStudyDescription(String v)  { this.studyDescription = v; }

        public String getSeriesDescription()       { return seriesDescription; }
        public void setSeriesDescription(String v) { this.seriesDescription = v; }

        public String getStudyDate()               { return studyDate; }
        public void setStudyDate(String v)         { this.studyDate = v; }

        public String getInstitutionName()         { return institutionName; }
        public void setInstitutionName(String v)   { this.institutionName = v; }

        public String getManufacturer()            { return manufacturer; }
        public void setManufacturer(String v)      { this.manufacturer = v; }

        public String getImageSize()               { return imageSize; }
        public void setImageSize(String v)         { this.imageSize = v; }

        public String getBitsAllocated()           { return bitsAllocated; }
        public void setBitsAllocated(String v)     { this.bitsAllocated = v; }

        public String getKvp()                     { return kvp; }
        public void setKvp(String v)               { this.kvp = v; }

        public String getExposureTime()            { return exposureTime; }
        public void setExposureTime(String v)      { this.exposureTime = v; }

        public String getTransferSyntax()          { return transferSyntax; }
        public void setTransferSyntax(String v)    { this.transferSyntax = v; }
    }
}