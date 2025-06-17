package com.aidims.aidimsbackend.service;

import com.aidims.aidimsbackend.repository.ImagingResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class DicomViewerService {

    @Autowired
    private ImagingResultRepository imagingResultRepository;

    public List<Map<String, Object>> getAllDicomImages() {
        return imagingResultRepository.fetchDicomInfoWithPatient();
    }
}
