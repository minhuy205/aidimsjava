package com.aidims.aidimsbackend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "patient")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id")
    private Long patient_id;

    @Column(name = "patient_code")
    private String patient_code;

    @Column(name = "full_name")
    private String full_name;

    @Column(name = "date_of_birth")
    private String date_of_birth;

    @Column(name = "gender")
    private String gender;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "address")
    private String address;

    @Column(name = "identity_number")
    private String identity_number;

    @Column(name = "insurance_number")
    private String insurance_number;

    @Column(name = "emergency_contact_name")
    private String emergency_contact_name;

    @Column(name = "emergency_contact_phone")
    private String emergency_contact_phone;

    @Column(name = "blood_type")
    private String blood_type;

    @Column(name = "allergies")
    private String allergies;

    @Column(name = "medical_history")
    private String medical_history;

    @Column(name = "age")
    private Integer age;

    // THÊM CÁC FIELD SINH HIỆU
    @Column(name = "temperature")
    private Double temperature;

    @Column(name = "heart_rate")
    private Integer heart_rate;

    @Column(name = "blood_pressure")
    private String blood_pressure;

    @Column(name = "respiratory_rate")
    private Integer respiratory_rate;

    @Column(name = "oxygen_saturation")
    private Integer oxygen_saturation;

    // Default constructor
    public Patient() {}

    // Getters and setters (giữ nguyên các getter/setter cũ và thêm mới)
    public Long getPatient_id() { return patient_id; }
    public void setPatient_id(Long patient_id) { this.patient_id = patient_id; }

    public String getPatient_code() { return patient_code; }
    public void setPatient_code(String patient_code) { this.patient_code = patient_code; }

    public String getFull_name() { return full_name; }
    public void setFull_name(String full_name) { this.full_name = full_name; }

    public String getDate_of_birth() { return date_of_birth; }
    public void setDate_of_birth(String date_of_birth) { this.date_of_birth = date_of_birth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getIdentity_number() { return identity_number; }
    public void setIdentity_number(String identity_number) { this.identity_number = identity_number; }

    public String getInsurance_number() { return insurance_number; }
    public void setInsurance_number(String insurance_number) { this.insurance_number = insurance_number; }

    public String getEmergency_contact_name() { return emergency_contact_name; }
    public void setEmergency_contact_name(String emergency_contact_name) { this.emergency_contact_name = emergency_contact_name; }

    public String getEmergency_contact_phone() { return emergency_contact_phone; }
    public void setEmergency_contact_phone(String emergency_contact_phone) { this.emergency_contact_phone = emergency_contact_phone; }

    public String getBlood_type() { return blood_type; }
    public void setBlood_type(String blood_type) { this.blood_type = blood_type; }

    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }

    public String getMedical_history() { return medical_history; }
    public void setMedical_history(String medical_history) { this.medical_history = medical_history; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    // THÊM GETTERS/SETTERS CHO SINH HIỆU
    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Integer getHeart_rate() { return heart_rate; }
    public void setHeart_rate(Integer heart_rate) { this.heart_rate = heart_rate; }

    public String getBlood_pressure() { return blood_pressure; }
    public void setBlood_pressure(String blood_pressure) { this.blood_pressure = blood_pressure; }

    public Integer getRespiratory_rate() { return respiratory_rate; }
    public void setRespiratory_rate(Integer respiratory_rate) { this.respiratory_rate = respiratory_rate; }

    public Integer getOxygen_saturation() { return oxygen_saturation; }
    public void setOxygen_saturation(Integer oxygen_saturation) { this.oxygen_saturation = oxygen_saturation; }
}