package com.aidims.aidimsbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aidims.aidimsbackend.entity.VerifyImage;

@Repository
public interface VerifyImageRepository extends JpaRepository<VerifyImage, Long> {
}
