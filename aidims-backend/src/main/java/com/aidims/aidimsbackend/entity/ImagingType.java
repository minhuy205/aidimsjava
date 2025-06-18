package com.aidims.aidimsbackend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "imaging_types")
public class ImagingType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imaging_type_id")
    private Long imagingTypeId;

    @Column(name = "type_name", nullable = false)
    private String typeName;

    @Column(name = "description")
    private String description;

    // Getters and Setters

    public Long getImagingTypeId() {
        return imagingTypeId;
    }

    public void setImagingTypeId(Long imagingTypeId) {
        this.imagingTypeId = imagingTypeId;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
