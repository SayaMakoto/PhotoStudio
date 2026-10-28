package com.photostudio.model.equipment;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "equipments")
@Getter
@Setter
@NoArgsConstructor
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private EquipmentType type;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "brand", length = 255)
    private String brand;

    @Column(name = "model", length = 255)
    private String model;

    @Column(name = "serial_number", unique = true, length = 255)
    private String serialNumber;

    @Column(name = "purchase_date")
    private LocalDateTime purchaseDate;

    @Column(name = "description", length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EquipmentStatus status = EquipmentStatus.available;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
