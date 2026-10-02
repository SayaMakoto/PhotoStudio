
package com.photostudio.dto;

import java.time.LocalDateTime;
import java.util.Set;

public class EquipmentRequest {

    private String type;
    private String name;
    private String brand;
    private String model;
    private String serialNumber;
    private LocalDateTime purchaseDate;
    private String description;
    private String status;

    private static final Set<String> VALID_TYPES = Set.of(
            "camera", "lens", "lighting", "tripod", "other");

    private static final Set<String> VALID_STATUSES = Set.of(
            "available", "in_use", "maintenance", "broken", "retired");

    public void validate() {
        if (type == null || !VALID_TYPES.contains(type)) {
            throw new IllegalArgumentException("Loại thiết bị không hợp lệ");
        }

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Tên thiết bị không được để trống");
        }

        if (name.length() > 255) {
            throw new IllegalArgumentException("Tên thiết bị tối đa 255 ký tự");
        }

        if (status != null && !VALID_STATUSES.contains(status)) {
            throw new IllegalArgumentException("Trạng thái thiết bị không hợp lệ");
        }

        if (brand != null && brand.length() > 255) {
            throw new IllegalArgumentException("Thương hiệu tối đa 255 ký tự");
        }

        if (model != null && model.length() > 255) {
            throw new IllegalArgumentException("Model tối đa 255 ký tự");
        }

        if (serialNumber != null && serialNumber.length() > 255) {
            throw new IllegalArgumentException("Số serial tối đa 255 ký tự");
        }

        if (description != null && description.length() > 255) {
            throw new IllegalArgumentException("Mô tả tối đa 255 ký tự");
        }
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public LocalDateTime getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDateTime purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}