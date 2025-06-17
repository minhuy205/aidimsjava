package com.aidims.aidimsbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

import com.aidims.aidimsbackend.entity.ImagingResult;

@Repository
public interface ImagingResultRepository extends JpaRepository<ImagingResult, Long> {

    @Query(value = """
        SELECT r.result_id AS id,
               r.dicom_file_path AS fileName,
               r.thumbnail_path AS imageUrl,
               t.type_code AS modality,
               DATE(ir.created_at) AS dateTaken,
               p.patient_code AS patientCode,
               p.full_name AS fullName,
               CONCAT('Ảnh ', t.type_name, ' - ', ir.body_part) AS description
        FROM imaging_results r
        JOIN imaging_requests ir ON r.request_id = ir.request_id
        JOIN imaging_types t ON ir.imaging_type_id = t.type_id
        JOIN medical_records mr ON ir.record_id = mr.record_id
        JOIN patients p ON mr.patient_id = p.patient_id
    """, nativeQuery = true)
    List<Map<String, Object>> fetchDicomInfoWithPatient();
}
