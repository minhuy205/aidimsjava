package com.aidims.aidimsbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aidims.aidimsbackend.entity.Doctor;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    // Lấy danh sách bác sĩ theo chuyên khoa
    List<Doctor> findByDepartmentIgnoreCase(String department);
}