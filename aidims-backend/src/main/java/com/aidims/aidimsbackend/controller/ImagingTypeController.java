package com.aidims.aidimsbackend.controller;

import com.aidims.aidimsbackend.entity.ImagingType;
import com.aidims.aidimsbackend.repository.ImagingTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/imaging-types")
@CrossOrigin(origins = "*")
public class ImagingTypeController {

    @Autowired
    private ImagingTypeRepository imagingTypeRepository;

    @GetMapping
    public List<ImagingType> getAll() {
        return imagingTypeRepository.findAll();
    }
}
