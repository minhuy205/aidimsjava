package com.aidims.aidimsbackend.repository;

import com.aidims.aidimsbackend.entity.ImagingType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImagingTypeRepository extends JpaRepository<ImagingType, Integer> {
    Optional<ImagingType> findByTypeName(String typeName);
}
