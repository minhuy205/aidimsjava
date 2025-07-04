package com.aidims.aidimsbackend.service;

import com.aidims.aidimsbackend.entity.ImagingType;
import com.aidims.aidimsbackend.repository.ImagingTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ImagingTypeService {

    @Autowired
    private ImagingTypeRepository imagingTypeRepository;

    public ImagingType getByCode(String code) {
        return imagingTypeRepository.findByTypeCodeIgnoreCase(code);
    }
}
