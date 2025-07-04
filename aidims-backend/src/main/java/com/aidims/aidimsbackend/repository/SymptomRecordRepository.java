package com.aidims.aidimsbackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aidims.aidimsbackend.entity.SymptomRecord;

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

    // Kiểm tra bản ghi trùng lặp trong vòng 5 phút cho cùng bệnh nhân và triệu chứng chính (native query)
    @Query(value = "SELECT COUNT(*) > 0 FROM symptom WHERE patient_id = :patientId AND main_symptom = :mainSymptom AND created_at >= NOW() - INTERVAL 5 MINUTE", nativeQuery = true)
    boolean existsRecentDuplicate(@Param("patientId") Long patientId, @Param("mainSymptom") String mainSymptom);
}