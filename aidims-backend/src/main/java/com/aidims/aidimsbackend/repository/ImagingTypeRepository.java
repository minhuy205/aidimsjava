package com.aidims.aidimsbackend.repository;

import com.aidims.aidimsbackend.entity.ImagingType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImagingTypeRepository extends JpaRepository<ImagingType, Long> {
    ImagingType findByTypeCodeIgnoreCase(String typeCode);
}
