package com.aidims.aidimsbackend.repository;

import com.aidims.aidimsbackend.entity.DicomViewerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DicomViewerRepository extends JpaRepository<DicomViewerEntity, Long> {

    // Lấy tất cả DICOM đã import thành công
    @Query("SELECT d FROM DicomViewerEntity d WHERE d.status = 'imported' ORDER BY d.importDate DESC")
    List<DicomViewerEntity> findAllImportedDicoms();

    // Tìm theo tên file chính xác để lấy đường dẫn
    DicomViewerEntity findByFileName(String fileName);

    // Tìm theo mã bệnh nhân
    List<DicomViewerEntity> findByPatientCodeAndStatus(String patientCode, String status);

    // Tìm kiếm theo từ khóa
    @Query("SELECT d FROM DicomViewerEntity d WHERE d.status = 'imported' AND " +
            "(d.fileName LIKE %:keyword% OR d.patientCode LIKE %:keyword% OR d.notes LIKE %:keyword%)")
    List<DicomViewerEntity> searchByKeyword(@Param("keyword") String keyword);
}