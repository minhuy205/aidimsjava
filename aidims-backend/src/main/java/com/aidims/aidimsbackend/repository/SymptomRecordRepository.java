// SymptomRecordRepository.java
package com.aidims.aidimsbackend.repository;

import com.aidims.aidimsbackend.entity.SymptomRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SymptomRecordRepository extends JpaRepository<SymptomRecord, Long> {

    // Tìm tất cả triệu chứng theo patient_id
    List<SymptomRecord> findByPatientId(Long patientId);

    // Tìm triệu chứng mới nhất của bệnh nhân
    @Query("SELECT s FROM SymptomRecord s WHERE s.patientId = :patientId ORDER BY s.createdAt DESC")
    List<SymptomRecord> findByPatientIdOrderByCreatedAtDesc(@Param("patientId") Long patientId);

    // Kiểm tra xem bệnh nhân có triệu chứng nào không
    boolean existsByPatientId(Long patientId);

    // Đếm số lượng triệu chứng của bệnh nhân
    long countByPatientId(Long patientId);
}