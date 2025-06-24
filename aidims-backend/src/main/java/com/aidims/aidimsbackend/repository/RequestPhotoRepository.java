package com.aidims.aidimsbackend.repository;

import com.aidims.aidimsbackend.entity.RequestPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RequestPhotoRepository extends JpaRepository<RequestPhoto, Long> {

    Optional<RequestPhoto> findByRequestCode(String requestCode);

    List<RequestPhoto> findByPatientId(Long patientId);

    @Query("SELECT r FROM RequestPhoto r WHERE r.patientId = :patientId ORDER BY r.createdAt DESC")
    List<RequestPhoto> findByPatientIdOrderByCreatedAtDesc(@Param("patientId") Long patientId);

    boolean existsByRequestCode(String requestCode);
}