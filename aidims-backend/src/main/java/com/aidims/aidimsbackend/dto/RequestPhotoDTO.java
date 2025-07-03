package com.aidims.aidimsbackend.dto;

import java.time.LocalDate;

public class RequestPhotoDTO {
    private Long requestId;
    private String requestCode;
    private Long patientId;
    private String imagingType;
    private String bodyPart;
    private String clinicalIndication;
    private String notes;
    private String priorityLevel;
    private LocalDate requestDate;
    private String status;

    // Thông tin bệnh nhân mở rộng
    private String patientCode;
    private String fullName;
    private String dateOfBirth;
    private String gender;
    private String phone;
    private String email;
    private String address;
    private String identityNumber;
    private String insuranceNumber;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String bloodType;
    private String allergies;
    private String medicalHistory;
    private Integer age;
    private Double temperature;
    private Integer heartRate;
    private String bloodPressure;
    private Integer respiratoryRate;
    private Integer oxygenSaturation;

    // Constructors
    public RequestPhotoDTO() {}

    // Getters and Setters
    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }

    public String getRequestCode() { return requestCode; }
    public void setRequestCode(String requestCode) { this.requestCode = requestCode; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getImagingType() { return imagingType; }
    public void setImagingType(String imagingType) { this.imagingType = imagingType; }

    public String getBodyPart() { return bodyPart; }
    public void setBodyPart(String bodyPart) { this.bodyPart = bodyPart; }

    public String getClinicalIndication() { return clinicalIndication; }
    public void setClinicalIndication(String clinicalIndication) { this.clinicalIndication = clinicalIndication; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getPriorityLevel() { return priorityLevel; }
    public void setPriorityLevel(String priorityLevel) { this.priorityLevel = priorityLevel; }

    public LocalDate getRequestDate() { return requestDate; }
    public void setRequestDate(LocalDate requestDate) { this.requestDate = requestDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    // Getters & Setters cho các trường mới
    public String getPatientCode() { return patientCode; }
    public void setPatientCode(String patientCode) { this.patientCode = patientCode; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getIdentityNumber() { return identityNumber; }
    public void setIdentityNumber(String identityNumber) { this.identityNumber = identityNumber; }
    public String getInsuranceNumber() { return insuranceNumber; }
    public void setInsuranceNumber(String insuranceNumber) { this.insuranceNumber = insuranceNumber; }
    public String getEmergencyContactName() { return emergencyContactName; }
    public void setEmergencyContactName(String emergencyContactName) { this.emergencyContactName = emergencyContactName; }
    public String getEmergencyContactPhone() { return emergencyContactPhone; }
    public void setEmergencyContactPhone(String emergencyContactPhone) { this.emergencyContactPhone = emergencyContactPhone; }
    public String getBloodType() { return bloodType; }
    public void setBloodType(String bloodType) { this.bloodType = bloodType; }
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    public String getMedicalHistory() { return medicalHistory; }
    public void setMedicalHistory(String medicalHistory) { this.medicalHistory = medicalHistory; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }
    public Integer getHeartRate() { return heartRate; }
    public void setHeartRate(Integer heartRate) { this.heartRate = heartRate; }
    public String getBloodPressure() { return bloodPressure; }
    public void setBloodPressure(String bloodPressure) { this.bloodPressure = bloodPressure; }
    public Integer getRespiratoryRate() { return respiratoryRate; }
    public void setRespiratoryRate(Integer respiratoryRate) { this.respiratoryRate = respiratoryRate; }
    public Integer getOxygenSaturation() { return oxygenSaturation; }
    public void setOxygenSaturation(Integer oxygenSaturation) { this.oxygenSaturation = oxygenSaturation; }
}
