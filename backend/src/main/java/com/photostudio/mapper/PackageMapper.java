package com.photostudio.mapper;

import com.photostudio.dto.PackageEquipmentItemRequest;
import com.photostudio.dto.PackageEquipmentItemResponse;
import com.photostudio.dto.PackageRequest;
import com.photostudio.dto.PackageResponse;
import com.photostudio.model.EquipmentType;
import com.photostudio.model.Package;
import com.photostudio.model.PackageEquipment;
import com.photostudio.model.PackageStatus;

import java.util.ArrayList;
import java.util.List;

public class PackageMapper {

    public static Package toEntity(PackageRequest request) {
        Package pkg = new Package();
        pkg.setName(request.getName());
        pkg.setDescription(request.getDescription());
        pkg.setDuration(request.getDuration() != null ? request.getDuration() : 0);
        pkg.setPrice(request.getPrice() != null ? request.getPrice() : 0.0);

        if (request.getStatus() != null) {
            pkg.setStatus(PackageStatus.valueOf(request.getStatus().trim().toLowerCase()));
        }

        if (request.getEquipments() != null) {
            for (PackageEquipmentItemRequest item : request.getEquipments()) {
                PackageEquipment pe = new PackageEquipment();
                pe.setEquipmentType(EquipmentType.valueOf(item.getEquipmentType().trim().toLowerCase()));
                pe.setQuantity(item.getQuantity() != null ? item.getQuantity() : 1);
                pkg.addEquipment(pe);
            }
        }

        return pkg;
    }

    public static void updateEntity(PackageRequest request, Package pkg) {
        pkg.setName(request.getName());
        pkg.setDescription(request.getDescription());
        pkg.setDuration(request.getDuration() != null ? request.getDuration() : 0);
        pkg.setPrice(request.getPrice() != null ? request.getPrice() : 0.0);

        if (request.getStatus() != null) {
            pkg.setStatus(PackageStatus.valueOf(request.getStatus().trim().toLowerCase()));
        }

        pkg.getPackageEquipments().clear();

        if (request.getEquipments() != null) {
            for (PackageEquipmentItemRequest item : request.getEquipments()) {
                PackageEquipment pe = new PackageEquipment();
                pe.setEquipmentType(EquipmentType.valueOf(item.getEquipmentType().trim().toLowerCase()));
                pe.setQuantity(item.getQuantity() != null ? item.getQuantity() : 1);
                pkg.addEquipment(pe);
            }
        }
    }

    public static PackageResponse toResponse(Package pkg) {
        List<PackageEquipmentItemResponse> eqList = new ArrayList<>();
        if (pkg.getPackageEquipments() != null) {
            for (PackageEquipment pe : pkg.getPackageEquipments()) {
                eqList.add(new PackageEquipmentItemResponse(
                        pe.getId(),
                        pe.getEquipmentType().name(),
                        pe.getQuantity()
                ));
            }
        }

        return new PackageResponse(
                pkg.getId(),
                pkg.getName(),
                pkg.getDescription(),
                pkg.getDuration(),
                pkg.getPrice(),
                pkg.getStatus() != null ? pkg.getStatus().name() : null,
                pkg.getCreatedAt(),
                pkg.getUpdatedAt(),
                eqList
        );
    }
}
