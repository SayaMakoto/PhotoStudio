package com.photostudio.model.packages;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "packages")
@Getter
@Setter
@NoArgsConstructor
public class Package {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "duration", nullable = false)
    private Integer duration = 0;

    @Column(name = "price", nullable = false)
    private Double price = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PackageStatus status = PackageStatus.active;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "packageEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PackageEquipment> packageEquipments = new ArrayList<>();

    @OneToMany(mappedBy = "packageEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PackageService> packageServices = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void addEquipment(PackageEquipment equipment) {
        packageEquipments.add(equipment);
        equipment.setPackageEntity(this);
    }

    public void removeEquipment(PackageEquipment equipment) {
        packageEquipments.remove(equipment);
        equipment.setPackageEntity(null);
    }

    public void addService(PackageService packageService) {
        packageServices.add(packageService);
        packageService.setPackageEntity(this);
    }

    public void removeService(PackageService packageService) {
        packageServices.remove(packageService);
        packageService.setPackageEntity(null);
    }
}
