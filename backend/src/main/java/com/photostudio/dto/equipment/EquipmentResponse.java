package com.photostudio.dto.equipment;

import java.time.LocalDateTime;

public class EquipmentResponse {

    private Long id;
    private String type;
    private String name;
    private String brand;
    private String model;
    private String serialNumber;
    private LocalDateTime purchaseDate;
    private String description;
    private String status;

    public EquipmentResponse(
            Long id,
            String type,
            String name,
            String brand,
            String model,
            String serialNumber,
            LocalDateTime purchaseDate,
            String description,
            String status) {

        this.id = id;
        this.type = type;
        this.name = name;
        this.brand = brand;
        this.model = model;
        this.serialNumber = serialNumber;
        this.purchaseDate = purchaseDate;
        this.description = description;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public String getName() {
        return name;
    }

    public String getBrand() {
        return brand;
    }

    public String getModel() {
        return model;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public LocalDateTime getPurchaseDate() {
        return purchaseDate;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }
}
